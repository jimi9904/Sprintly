import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inviteMember } from '../../redux/slices/authSlice';
import { addActivity } from '../../redux/slices/activitySlice';
import { X, Mail, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const InviteMemberModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();


    const [formData, setFormData] = useState({
        email: '',
        role: 'member',
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await dispatch(inviteMember(formData)).unwrap();
            dispatch(addActivity({
                user: 'You',
                action: 'invited member',
                target: formData.email
            }));
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ email: '', role: 'member' });
            }, 1000);
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary-500" />
                        Invite New Member
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Invitation Sent!</h3>
                            <p className="text-stone-500">An email has been sent to {formData.email}</p>
                        </div>
                    ) : (
                        <>
                            <Input
                                label="Email Address"
                                type="text"
                                inputMode="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g. colleague@example.com"
                                required
                                icon={Mail}
                                autoComplete="off"
                            />

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                                    Role
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                                    >
                                        <option value="member">Member (Can view & edit assigned tasks)</option>
                                        <option value="admin">Admin (Full access)</option>
                                        <option value="viewer">Viewer (Read only)</option>
                                    </select>
                                </div>
                            </div>



                            {status === 'error' && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                    Failed to send invitation. Please try again.
                                </div>
                            )}

                            <div className="pt-2 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={onClose} disabled={status === 'loading'}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Sending...' : 'Send Invite'}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
