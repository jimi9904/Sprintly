import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/uiSlice';
import { updateProfile } from '../redux/slices/authSlice';
import { User, Bell, Shield, Moon, Sun, Monitor, LogOut, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { theme } = useSelector((state) => state.ui);

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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
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

                        {activeTab === 'integrations' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Connected Apps</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Slack', description: 'Receive task notifications and updates in Slack channels.', connected: true, color: 'bg-purple-600' },
                                        { name: 'GitHub', description: 'Link commits and pull requests to tasks.', connected: false, color: 'bg-stone-800' },
                                        { name: 'Google Calendar', description: 'Sync task due dates with your calendar.', connected: false, color: 'bg-blue-500' },
                                        { name: 'Figma', description: 'Embed designs directly into task descriptions.', connected: true, color: 'bg-pink-500' },
                                    ].map((app) => (
                                        <div key={app.name} className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-orange-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center text-white font-bold`}>
                                                    {app.name[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-stone-900 dark:text-white">{app.name}</h4>
                                                    <p className="text-sm text-stone-500">{app.description}</p>
                                                </div>
                                            </div>
                                            <Button variant={app.connected ? 'outline' : 'primary'} size="sm">
                                                {app.connected ? 'Disconnect' : 'Connect'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                        <Button variant="ghost" className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30">Delete Account</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
