import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getTaskById, updateTask } from '../../redux/slices/taskSlice';
import { closeTaskDrawer } from '../../redux/slices/uiSlice';
import {
    X, CheckSquare, Clock, User, Calendar, MessageSquare,
    Paperclip, AlignLeft, Layers, Save, MoreHorizontal
} from 'lucide-react';
import Input from '../../components/ui/Input';

const TaskDetailDrawer = () => {
    const dispatch = useDispatch();
    const { taskDrawerOpen, selectedTaskId } = useSelector((state) => state.ui);
    const { currentTask, loading } = useSelector((state) => state.tasks);

    const { teamMembers } = useSelector((state) => state.auth);

    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);


    const handleToggleAssignee = async (memberId) => {
        if (!currentTask) return;
        const currentIds = currentTask.assignees?.map(a => a._id || a) || [];
        const isAlreadyAssigned = currentIds.includes(memberId);
        const newAssignees = isAlreadyAssigned
            ? currentIds.filter(id => id !== memberId)
            : [...currentIds, memberId];
        await dispatch(updateTask({ id: currentTask._id, taskData: { assignees: newAssignees } }));
        dispatch(getTaskById(currentTask._id));
    };

    useEffect(() => {
        if (taskDrawerOpen && selectedTaskId) {
            dispatch(getTaskById(selectedTaskId));
        }
    }, [taskDrawerOpen, selectedTaskId, dispatch]);

    useEffect(() => {
        if (currentTask) {
            setEditTitle(currentTask.title || '');
            setEditDescription(currentTask.description || '');
        }
    }, [currentTask]);

    const handleClose = () => {
        setIsEditing(false);
        dispatch(closeTaskDrawer());
    };

    const handleSave = async () => {
        if (currentTask) {
            await dispatch(updateTask({
                id: currentTask._id,
                taskData: {
                    title: editTitle,
                    description: editDescription
                }
            }));
            setIsEditing(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (currentTask) {
            await dispatch(updateTask({ id: currentTask._id, taskData: { status: newStatus } }));
            // We dispatch getTaskById or rely on socket to update currentTask.
            // But since local slice might not update currentTask on updateTask call perfectly yet,
            // we re-fetch to ensure the drawer is perfectly synced.
            dispatch(getTaskById(currentTask._id));
        }
    };

    return (
        <AnimatePresence>
            {taskDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-stone-900 shadow-2xl z-50 flex flex-col border-l border-stone-200 dark:border-stone-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 sticky top-0 z-10 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                {currentTask && (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-semibold rounded uppercase tracking-wider">
                                            {currentTask.project?.name || 'Project'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            {loading || !currentTask ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-8 h-8 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-fade-in">

                                    {/* Title Section */}
                                    <div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full text-3xl font-bold font-display bg-transparent border-b-2 border-primary-500 focus:outline-none text-stone-900 dark:text-white pb-2"
                                                autoFocus
                                            />
                                        ) : (
                                            <h1
                                                onClick={() => setIsEditing(true)}
                                                className="text-3xl font-bold font-display text-stone-900 dark:text-white cursor-text hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg -ml-2 p-2 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                                            >
                                                {currentTask.title}
                                            </h1>
                                        )}
                                    </div>

                                    {/* Meta Grid */}
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 p-4 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-stone-100 dark:border-stone-800">

                                        {/* Status */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                                                <CheckSquare className="w-4 h-4" /> Status
                                            </div>
                                            <select
                                                value={currentTask.status}
                                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                                className="bg-transparent border-none text-sm font-semibold cursor-pointer outline-none focus:ring-0 text-stone-700 dark:text-stone-300 capitalize text-right"
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="review">Review</option>
                                                <option value="done">Done</option>
                                            </select>
                                        </div>

                                        {/* Assignees */}
                                        <div className="flex flex-col gap-2 col-span-2">
                                            <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                                                <User className="w-4 h-4" /> Assignees
                                            </div>
                                            <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
                                                {teamMembers && teamMembers.length > 0 ? teamMembers.map(member => {
                                                    const assignedIds = currentTask.assignees?.map(a => a._id || a) || [];
                                                    const isAssigned = assignedIds.includes(member._id);
                                                    return (
                                                        <label
                                                            key={member._id}
                                                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors select-none
                                                                ${isAssigned ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                                {member.name?.charAt(0)}
                                                            </div>
                                                            <span className={`flex-1 text-sm font-medium truncate ${isAssigned ? 'text-primary-600 dark:text-primary-400' : 'text-stone-800 dark:text-stone-200'}`}>
                                                                {member.name}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={isAssigned}
                                                                onChange={() => handleToggleAssignee(member._id)}
                                                                className="w-4 h-4 rounded accent-primary-500 cursor-pointer shrink-0"
                                                            />
                                                        </label>
                                                    );
                                                }) : (
                                                    <div className="px-3 py-4 text-xs text-stone-400 text-center italic">No team members</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Due Date */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                                                <Calendar className="w-4 h-4" /> Due Date
                                            </div>
                                            <div className="text-sm font-medium text-stone-700 dark:text-stone-300">
                                                {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : 'Not set'}
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                                                <Clock className="w-4 h-4" /> Priority
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${currentTask.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                                currentTask.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                                                }`}>
                                                {currentTask.priority}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2 uppercase tracking-wider">
                                                <AlignLeft className="w-4 h-4 text-stone-400" /> Description
                                            </h3>
                                            {!isEditing && (
                                                <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-primary-500 hover:text-primary-600">Edit</button>
                                            )}
                                        </div>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    rows={4}
                                                    className="w-full p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 dark:text-white text-sm resize-y"
                                                    placeholder="Add a more detailed description..."
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300">Cancel</button>
                                                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg shadow-md shadow-primary-500/20 hover:bg-primary-600 flex items-center gap-2 transition-all">
                                                        <Save className="w-4 h-4" /> Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setIsEditing(true)}
                                                className={`text-sm leading-relaxed cursor-text hover:bg-stone-50 dark:hover:bg-stone-800/50 p-4 -mx-4 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 rounded-xl transition-all ${!currentTask.description ? 'text-stone-400 italic' : 'text-stone-600 dark:text-stone-300'}`}
                                            >
                                                {currentTask.description || "Add a more detailed description..."}
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    {currentTask.attachments && currentTask.attachments.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2 mb-3 uppercase tracking-wider">
                                                <Paperclip className="w-4 h-4 text-stone-400" /> Attachments
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {currentTask.attachments.map((file, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`http://localhost:5000${file.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-primary-500 hover:shadow-sm transition-all group cursor-pointer"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center shrink-0">
                                                            <Paperclip className="w-5 h-5 text-stone-400 group-hover:text-primary-500 transition-colors" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">{file.name}</p>
                                                            <p className="text-xs text-stone-500 truncate">Added {new Date(file.uploadedAt || Date.now()).toLocaleDateString()}</p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Subtasks Placeholder */}
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                            <Layers className="w-4 h-4 text-stone-400" /> Subtasks
                                        </h3>
                                        <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
                                            <div className="p-3 flex items-center gap-3 bg-stone-50 dark:bg-stone-800/30 text-stone-500 text-sm">
                                                <div className="w-4 h-4 border-2 border-stone-300 dark:border-stone-600 rounded"></div>
                                                <span className="italic">Design Review (Mock)</span>
                                            </div>
                                            <div className="p-3 flex items-center gap-3 bg-stone-50 dark:bg-stone-800/30 text-stone-500 text-sm">
                                                <div className="w-4 h-4 border-2 border-stone-300 dark:border-stone-600 rounded"></div>
                                                <span className="italic">Client Approval (Mock)</span>
                                            </div>
                                        </div>
                                        <button className="mt-3 text-xs font-semibold text-stone-500 hover:text-primary-500 transition-colors flex items-center gap-1">+ Add Subtask</button>
                                    </div>

                                    {/* Activity / Comments Placeholder */}
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                            <MessageSquare className="w-4 h-4 text-stone-400" /> Activity
                                        </h3>
                                        <div className="flex gap-4 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                ME
                                            </div>
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <textarea
                                                        className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 pb-10 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 dark:text-white resize-none"
                                                        placeholder="Ask a question or post an update..."
                                                        rows={2}
                                                    ></textarea>
                                                    <div className="absolute bottom-2 right-2 flex gap-2">
                                                        <button className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors rounded-lg">
                                                            <Paperclip className="w-4 h-4" />
                                                        </button>
                                                        <button className="px-3 py-1.5 bg-stone-900 dark:bg-stone-700 text-white text-xs font-bold rounded-lg shadow hover:bg-black dark:hover:bg-stone-600 transition-colors">
                                                            Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center p-4 border border-dashed border-stone-200 dark:border-stone-700 rounded-xl text-stone-400 text-sm italic">
                                            No recent activity on this task.
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailDrawer;
