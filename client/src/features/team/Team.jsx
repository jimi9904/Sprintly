import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, UserPlus, Building, X, Check, Plus, Trash2, MoreVertical, ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addMemberToTeam, removeMemberFromTeam, fetchWorkspaceData } from '../../redux/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import InviteMemberModal from './InviteMemberModal';

// ── Dropdown on member card ───────────────────────────────────────────────────
const CardMenu = ({ member, teamName, onRemove }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div ref={ref} className="absolute top-3 right-3">
            <button onClick={() => setOpen(p => !p)} className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        className="absolute right-0 top-8 w-44 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl z-30 overflow-hidden"
                    >
                        <button onClick={() => { setOpen(false); onRemove(member, teamName); }} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium">
                            <Trash2 className="w-4 h-4" /> Remove from Team
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Add Member to Team modal ──────────────────────────────────────────────────
const AddToTeamModal = ({ teamName, workspaceMembers, onClose }) => {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);
    const [status, setStatus] = useState('idle');
    const eligible = (workspaceMembers || []).filter(m => !(m.teams || []).includes(teamName));
    const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const handleAdd = async () => {
        if (!selected.length) return;
        setStatus('loading');
        try {
            await Promise.all(selected.map(id => dispatch(addMemberToTeam({ memberId: id, teamName })).unwrap()));
            setStatus('success');
            setTimeout(onClose, 900);
        } catch { setStatus('idle'); }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary-500" /> Add to "{teamName}"
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700"><X className="w-4 h-4 text-stone-500" /></button>
                </div>
                <div className="overflow-y-auto flex-1 p-4">
                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6" /></div>
                            <p className="font-semibold text-stone-800 dark:text-white">Members added!</p>
                        </div>
                    ) : eligible.length === 0 ? (
                        <div className="text-center py-10 text-stone-400">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">All members are already in this team.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {eligible.map(member => {
                                const isSel = selected.includes(member._id);
                                return (
                                    <div key={member._id} onClick={() => toggle(member._id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none ${isSel ? 'border-primary-500/50 bg-primary-50 dark:bg-primary-900/10' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'}`}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300 shrink-0">
                                                {member.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-stone-900 dark:text-white truncate capitalize">{member.name}</p>
                                                <p className="text-xs text-stone-400 truncate">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSel ? 'bg-primary-500 border-primary-500 text-white' : 'border-stone-300'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {status !== 'success' && eligible.length > 0 && (
                    <div className="px-5 py-4 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
                        <span className="text-xs text-stone-400">{selected.length} selected</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={onClose} disabled={status === 'loading'}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={!selected.length || status === 'loading'}>
                                {status === 'loading' ? 'Adding...' : `Add ${selected.length || ''} Member${selected.length !== 1 ? 's' : ''}`}
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// ── Confirm Remove modal ──────────────────────────────────────────────────────
const ConfirmRemoveModal = ({ member, teamName, onConfirm, onClose, loading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Remove from Team?</h3>
            <p className="text-sm text-stone-500 mb-6">
                <span className="font-semibold text-stone-700 dark:text-stone-200">{member?.name}</span> will be removed from <span className="font-semibold text-stone-700 dark:text-stone-200">{teamName}</span>.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
                <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60">
                    {loading ? 'Removing...' : 'Remove'}
                </button>
            </div>
        </motion.div>
    </div>
);

// ── Member Card ───────────────────────────────────────────────────────────────
const MemberCard = ({ member, index, groupIndex = 0, teamName, onRemove }) => {
    const initials = member.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
    return (
        <motion.div className="h-full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (groupIndex * 0.06) + (index * 0.04) }}>
            <Card className="h-full p-6 flex flex-col items-center text-center hover:border-primary-500/30 transition-all relative">
                {teamName && onRemove && <CardMenu member={member} teamName={teamName} onRemove={onRemove} />}

                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-800 flex items-center justify-center text-2xl font-bold text-stone-600 dark:text-stone-300 mb-4 shadow-inner shrink-0">
                    {initials}
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white capitalize truncate w-full">{member.name}</h3>

                <div className="flex items-center gap-1 mt-1">
                    {member.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />}
                    <p className="text-primary-500 font-medium text-sm capitalize">{member.role}</p>
                </div>

                <div className="flex items-center gap-1.5 text-stone-400 text-xs mt-2 w-full justify-center">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{member.email}</span>
                </div>

                <div className="min-h-[28px] flex flex-wrap gap-1 mt-3 justify-center">
                    {(member.teams || []).filter(t => t !== 'Owner').map(t => (
                        <span key={t} className="text-[10px] bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">{t}</span>
                    ))}
                </div>

                <div className="mt-auto pt-5 flex gap-2 w-full">
                    <Button variant="outline" className="flex-1 text-xs">View Profile</Button>
                    <Button variant="ghost" className="text-xs text-stone-500">Message</Button>
                </div>
            </Card>
        </motion.div>
    );
};

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, count, badge, action }) => (
    <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <Icon className="w-5 h-5 text-primary-500" />
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 font-display">{title}</h2>
        <span className="ml-1 bg-stone-100 dark:bg-stone-800 text-stone-500 text-xs font-bold px-2 py-0.5 rounded-full">
            {count} {count === 1 ? 'Member' : 'Members'}
        </span>
        {badge && (
            <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40 text-xs font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                {badge === 'admin' && <ShieldCheck className="w-3 h-3" />}{badge}
            </span>
        )}
        {action && <div className="ml-auto">{action}</div>}
    </div>
);

// ── Main Team page ────────────────────────────────────────────────────────────
const Team = () => {
    const { allMembers, myTeams, teamMembers } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [addToTeam, setAddToTeam] = useState(null);
    const [removeTarget, setRemoveTarget] = useState(null);
    const [removeLoading, setRemoveLoading] = useState(false);

    // Fetch fresh data every time the Team page is visited
    useEffect(() => {
        dispatch(fetchWorkspaceData());
    }, [dispatch]);

    // Use allMembers if available (new API), otherwise fall back to flat teamMembers
    const globalMembers = allMembers?.length ? allMembers : teamMembers;
    const teamsToShow = myTeams || [];

    const handleRemove = async () => {
        if (!removeTarget) return;
        setRemoveLoading(true);
        try {
            await dispatch(removeMemberFromTeam({ memberId: removeTarget.member._id, teamName: removeTarget.teamName })).unwrap();
        } finally {
            setRemoveLoading(false);
            setRemoveTarget(null);
        }
    };

    return (
        <div className="space-y-10">
            <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
            <AnimatePresence>
                {addToTeam && <AddToTeamModal teamName={addToTeam.teamName} workspaceMembers={addToTeam.workspaceMembers} onClose={() => setAddToTeam(null)} />}
                {removeTarget && (
                    <ConfirmRemoveModal member={removeTarget.member} teamName={removeTarget.teamName}
                        onConfirm={handleRemove} onClose={() => setRemoveTarget(null)} loading={removeLoading} />
                )}
            </AnimatePresence>

            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-white font-display">Team Members</h1>
                    <p className="text-stone-500 dark:text-stone-400">Manage your team and permissions.</p>
                </div>
                <Button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Invite Member
                </Button>
            </motion.div>

            {/* ── SECTION 1: ALL MEMBERS (same for every user) ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
                <SectionHeader icon={Users} title="All Members" count={globalMembers.length} />
                {globalMembers.length === 0 ? (
                    <div className="text-center py-16 text-stone-400">
                        <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-medium">No members yet. Invite someone to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 items-stretch">
                        {globalMembers.map((member, i) => (
                            <MemberCard key={member._id || i} member={member} index={i} />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* ── SECTION 2: MY TEAMS (only teams this user belongs to) ── */}
            {teamsToShow.length > 0 && (
                <div className="space-y-8">
                    {teamsToShow.map((team, groupIndex) => (
                        <motion.div
                            key={team.teamName}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + groupIndex * 0.08 }}
                            className="space-y-4"
                        >
                            <SectionHeader
                                icon={Building}
                                title={`${team.teamName} Team`}
                                count={team.members?.length || 0}
                                badge={team.myRole}
                                action={
                                    team.myRole === 'admin' ? (
                                        <button
                                            onClick={() => setAddToTeam({ teamName: team.teamName, workspaceMembers: globalMembers })}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-600 border border-primary-200 dark:border-primary-800/40 hover:border-primary-400 bg-primary-50 dark:bg-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-900/20 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Member
                                        </button>
                                    ) : null
                                }
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 items-stretch">
                                {(team.members || []).map((member, i) => (
                                    <MemberCard
                                        key={`${team.teamName}-${member._id || i}`}
                                        member={member}
                                        index={i}
                                        groupIndex={groupIndex + 1}
                                        teamName={team.teamName}
                                        onRemove={team.myRole === 'admin'
                                            ? (m, tn) => setRemoveTarget({ member: m, teamName: tn })
                                            : null
                                        }
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Team;
