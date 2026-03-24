import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTeam } from '../../redux/slices/authSlice';
import { addActivity } from '../../redux/slices/activitySlice';
import { X, Building, Users, AlignLeft, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateTeamModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { teamMembers, loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Track selected members by their ID
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [status, setStatus] = useState('idle');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleMember = (memberId) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await dispatch(createTeam({
                name: formData.name,
                description: formData.description,
                selectedMembers
            })).unwrap();

            dispatch(addActivity({
                user: 'You',
                action: 'created new team',
                target: formData.name
            }));

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', description: '' });
                setSelectedMembers([]);
            }, 1000);
        } catch (error) {
            setStatus('error');
        }
    };

    // Helper for generating fallback avatars
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 shrink-0">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary-500" />
                        Create New Team
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 p-4">
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Team Created!</h3>
                            <p className="text-stone-500">"{formData.name}" has been established.</p>
                        </div>
                    ) : (
                        <form id="createTeamForm" onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    label="Team Name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Engineering"
                                    required
                                    icon={Building}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                                        Description (Optional)
                                    </label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="What is this team responsible for?"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none h-24"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
                                <label className="flex items-center justify-between text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
                                    <span className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-stone-400" />
                                        Add Members
                                    </span>
                                    <span className="text-xs text-stone-500 font-normal">
                                        {selectedMembers.length} selected
                                    </span>
                                </label>

                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    {teamMembers.map((member) => {
                                        const isSelected = selectedMembers.includes(member._id);
                                        return (
                                            <div
                                                key={member._id}
                                                onClick={() => toggleMember(member._id)}
                                                className={`
                                                    flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none
                                                    ${isSelected
                                                        ? 'border-primary-500/50 bg-primary-50 dark:bg-primary-900/10'
                                                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300 shadow-inner">
                                                        {getInitials(member.name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-stone-900 dark:text-white leading-tight capitalize">{member.name}</p>
                                                        <div className="flex items-center flex-wrap gap-1 mt-0.5">
                                                            <span className="text-xs text-stone-400 capitalize">{member.role}</span>
                                                            {(member.teams && member.teams.length > 0) ? member.teams.map(t => (
                                                                <span key={t} className="text-[10px] bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 px-1.5 py-0.5 rounded-full font-medium">{t}</span>
                                                            )) : (
                                                                <span className="text-[10px] bg-stone-100 dark:bg-stone-700 text-stone-400 px-1.5 py-0.5 rounded-full">Unassigned</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`
                                                    w-5 h-5 rounded-full border flex items-center justify-center transition-all
                                                    ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-stone-300 dark:border-stone-600 text-transparent'}
                                                `}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {status !== 'success' && (
                    <div className="p-4 border-t border-stone-200 dark:border-stone-700 shrink-0 bg-stone-50 dark:bg-stone-800/50 flex justify-between items-center rounded-b-xl">
                        {status === 'error' ? (
                            <span className="text-sm text-red-500 font-medium">Failed to create team.</span>
                        ) : (
                            <span className="text-sm text-stone-500">Changes will reflect instantly.</span>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={status === 'loading'}>
                                Cancel
                            </Button>
                            <Button type="submit" form="createTeamForm" disabled={status === 'loading' || !formData.name.trim()}>
                                {status === 'loading' ? 'Creating...' : 'Create Team'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTeamModal;
