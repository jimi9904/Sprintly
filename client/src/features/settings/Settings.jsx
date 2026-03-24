import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { updateProfile, logout } from '../../redux/slices/authSlice';
import { User, Bell, Shield, Moon, Sun, Monitor, Zap, AlertTriangle, X, CheckCircle2, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { theme } = useSelector((state) => state.ui);

    // Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    });

    // Profile Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        department: user?.department || ''
    });

    // Update local state when redux user changes (initial load)
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                department: user.department || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isSaving = useSelector(state => state.auth.loading);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSaveProfile = async () => {
        setSaveSuccess(false);
        await dispatch(updateProfile(formData));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Monitor },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'integrations', label: 'Integrations', icon: Zap },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        setIsDeleting(true);
        setDeleteError('');
        try {
            await api.delete('/auth/me');
            dispatch(logout());
            navigate('/');
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    // Integration toggle
    const [toggleLoadingKey, setToggleLoadingKey] = useState(null);
    const [toastMsg, setToastMsg] = useState('');

    const handleToggleIntegration = async (key) => {
        setToggleLoadingKey(key);
        setToastMsg('');

        // Mocking the toggle action since it's not implemented in the backend/redux yet
        setTimeout(() => {
            setToggleLoadingKey(null);
            const appNames = { slack: 'Slack', github: 'GitHub', googleCalendar: 'Google Calendar', figma: 'Figma' };
            setToastMsg(`${appNames[key]} integration is not available in demo mode.`);
            setTimeout(() => setToastMsg(''), 3000);
        }, 800);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    data-aos="fade-down"
                    data-aos-delay="0"
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900 dark:text-white font-display">Settings</h1>
                        <p className="text-stone-500 dark:text-stone-400">Manage your account preferences and workspace settings.</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 space-y-2"
                    >
                        <Card className="p-2 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </Card>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-3"
                    >
                        <Card className="p-8 min-h-[500px]">
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-6 pb-8 border-b border-stone-100 dark:border-stone-800">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-orange-500/30">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-stone-900 dark:text-white">{user?.name}</h3>
                                            <p className="text-stone-500 dark:text-stone-400">{user?.role || 'Team Member'}</p>
                                            <Button variant="outline" size="sm">Change Avatar</Button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-lg font-semibold text-stone-900 dark:text-white">Personal Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                            <Input
                                                label="Email Address"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            <Input
                                                label="Job Title"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Product Designer"
                                            />
                                            <Input
                                                label="Department"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Design"
                                            />
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                onClick={handleSaveProfile}
                                                isLoading={isSaving}
                                                className={saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}
                                            >
                                                {saveSuccess ? 'Saved Changes!' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Interface Theme</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div
                                                onClick={() => dispatch(toggleTheme('light'))}
                                                className={`cursor-pointer rounded-xl border-2 p-4 space-y-3 transition-all ${theme === 'light'
                                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                                                    : 'border-stone-200 dark:border-stone-700 hover:border-orange-300'
                                                    }`}
                                            >
                                                <div className="h-24 rounded-lg bg-stone-100 border border-stone-200 relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-4 bg-white border-b border-stone-200"></div>
                                                    <div className="absolute top-6 left-2 w-16 h-12 bg-white rounded shadow-sm"></div>
                                                </div>
                                                <div className="flex items-center gap-2 font-medium text-stone-900 dark:text-white">
                                                    <Sun className="w-4 h-4" /> Light Mode
                                                </div>
                                            </div>

                                            <div
                                                onClick={() => dispatch(toggleTheme('dark'))}
                                                className={`cursor-pointer rounded-xl border-2 p-4 space-y-3 transition-all ${theme === 'dark'
                                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                                                    : 'border-stone-200 dark:border-stone-700 hover:border-orange-300'
                                                    }`}
                                            >
                                                <div className="h-24 rounded-lg bg-stone-900 border border-stone-800 relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-4 bg-stone-800 border-b border-stone-700"></div>
                                                    <div className="absolute top-6 left-2 w-16 h-12 bg-stone-800 rounded shadow-sm border border-stone-700"></div>
                                                </div>
                                                <div className="flex items-center gap-2 font-medium text-stone-900 dark:text-white">
                                                    <Moon className="w-4 h-4" /> Dark Mode
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">Notification Preferences</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                                            <div className="space-y-1">
                                                <h5 className="font-semibold text-stone-900 dark:text-white">Email Notifications</h5>
                                                <p className="text-sm text-stone-500">Receive daily summaries and critical updates.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={notifications.email}
                                                    onChange={() => handleNotificationToggle('email')}
                                                />
                                                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                                            <div className="space-y-1">
                                                <h5 className="font-semibold text-stone-900 dark:text-white">Push Notifications</h5>
                                                <p className="text-sm text-stone-500">Real-time alerts for tasks and mentions.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={notifications.push}
                                                    onChange={() => handleNotificationToggle('push')}
                                                />
                                                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'integrations' && (() => {
                                const integrations = user?.integrations || {};
                                const apps = [
                                    { key: 'slack', name: 'Slack', description: 'Receive task notifications and updates in Slack channels.', color: 'bg-purple-600', initial: 'S' },
                                    { key: 'github', name: 'GitHub', description: 'Link commits and pull requests to tasks.', color: 'bg-stone-800 dark:bg-stone-700', initial: 'G' },
                                    { key: 'googleCalendar', name: 'Google Calendar', description: 'Sync task due dates with your calendar.', color: 'bg-blue-500', initial: 'G' },
                                    { key: 'figma', name: 'Figma', description: 'Embed designs directly into task descriptions.', color: 'bg-pink-500', initial: 'F' },
                                ];
                                return (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <h3 className="text-xl font-bold text-stone-900 dark:text-white">Connected Apps</h3>
                                        <div className="space-y-3">
                                            {apps.map(app => {
                                                const connected = !!integrations[app.key];
                                                const isLoading = toggleLoadingKey === app.key;
                                                return (
                                                    <div key={app.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all
                                                        ${connected ? 'border-emerald-200 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-stone-100 dark:border-stone-800 hover:border-orange-500/30'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                                                                {app.initial}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-semibold text-stone-900 dark:text-white">{app.name}</h4>
                                                                    {connected && (
                                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                                                                            <CheckCircle2 className="w-3 h-3" /> Connected
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-stone-500">{app.description}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleIntegration(app.key)}
                                                            disabled={isLoading}
                                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all shrink-0 disabled:opacity-60
                                                                ${connected
                                                                    ? 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                                                                    : 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600'}`}
                                                        >
                                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : connected ? 'Disconnect' : 'Connect'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {toastMsg && (
                                            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 px-4 py-2.5 rounded-xl">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                {toastMsg}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">Security</h3>
                                    <div className="space-y-6">
                                        <div className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="font-semibold text-stone-900 dark:text-white">Password</h5>
                                                    <p className="text-sm text-stone-500">Last changed 3 months ago</p>
                                                </div>
                                                <Button variant="outline">Change Password</Button>
                                            </div>
                                        </div>
                                        <div className="p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl space-y-4">
                                            <div>
                                                <h5 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h5>
                                                <p className="text-sm text-red-600/80 dark:text-red-400/70">Irreversible actions for your account.</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                                                onClick={() => setShowDeleteModal(true)}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-200 dark:border-red-900/50 overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-red-50 dark:bg-red-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Delete Account</h2>
                                </div>
                                <button
                                    onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-6 space-y-4">
                                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                    This will <span className="font-bold text-red-600 dark:text-red-400">permanently delete</span> your account, all your workspaces, projects, tasks, and activity logs. <span className="font-semibold">This cannot be undone.</span>
                                </p>
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 space-y-1">
                                    <p className="font-semibold">You will lose:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-red-600/80 dark:text-red-400/80">
                                        <li>All workspaces you own</li>
                                        <li>All projects and tasks</li>
                                        <li>All activity history</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                                        Type <span className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">DELETE</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={e => setDeleteConfirmText(e.target.value)}
                                        placeholder="DELETE"
                                        autoComplete="off"
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all text-sm font-mono"
                                    />
                                </div>
                                {deleteError && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 flex justify-end gap-3">
                                <button
                                    onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                    className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                                >
                                    {isDeleting ? (
                                        <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Deleting...</>
                                    ) : (
                                        <><AlertTriangle className="w-4 h-4" /> Delete My Account</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Settings;
