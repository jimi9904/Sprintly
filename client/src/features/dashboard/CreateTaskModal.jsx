import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../redux/slices/taskSlice';
import { addActivity } from '../../redux/slices/activitySlice';
import { X, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const CreateTaskModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.projects);
    const { teamMembers } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignees: [],
        dueDate: '',
        priority: 'medium',
        status: 'todo',
        project: ''
    });


    const toggleAssignee = (memberId) => {
        setFormData(prev => ({
            ...prev,
            assignees: prev.assignees.includes(memberId)
                ? prev.assignees.filter(id => id !== memberId)
                : [...prev.assignees, memberId]
        }));
    };
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Backend task API expects /projects/:projectId/tasks
        // If a project isn't selected, pick the first one by default, or else it fails
        const targetProjectId = formData.project || (projects.length > 0 ? projects[0]._id : null);

        if (!targetProjectId) {
            alert('Please create a project first before creating tasks.');
            return;
        }

        const taskPayload = {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
            project: targetProjectId,
        };

        if (formData.assignees.length > 0) {
            taskPayload.assignees = formData.assignees;
        }

        if (formData.dueDate) {
            taskPayload.dueDate = formData.dueDate;
        }

        try {
            setIsUploading(true);

            // Upload files first if any
            if (files.length > 0) {
                const uploadedAttachments = [];
                for (const file of files) {
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    const res = await api.post('/upload', uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    uploadedAttachments.push({
                        url: res.data.url,
                        name: res.data.name || file.name
                    });
                }
                taskPayload.attachments = uploadedAttachments;
            }

            await dispatch(createTask({ projectId: targetProjectId, taskData: taskPayload })).unwrap();
            dispatch(addActivity({
                user: 'You',
                action: 'created task',
                target: formData.title
            }));

            // Reset state
            setFiles([]);
            setIsUploading(false);
            onClose();
            setFormData({
                title: '',
                description: '',
                assignees: [],
                dueDate: '',
                priority: 'medium',
                status: 'todo',
                project: ''
            });
        } catch (error) {
            console.error('Failed to create task:', error);
            setIsUploading(false);
            alert('Failed to create task.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">Create New Task</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <Input
                        label="Task Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none h-24"
                            placeholder="Task description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                                Assignees
                            </label>
                            <div className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden divide-y divide-stone-100 dark:divide-stone-800 max-h-40 overflow-y-auto custom-scrollbar">
                                {teamMembers && teamMembers.length > 0 ? teamMembers.map(member => {
                                    const selected = formData.assignees.includes(member._id);
                                    return (
                                        <label
                                            key={member._id}
                                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors select-none
                                                ${selected ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                                        >
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                {member.name.charAt(0)}
                                            </div>
                                            <span className={`flex-1 text-sm font-medium truncate ${selected ? 'text-primary-600 dark:text-primary-400' : 'text-stone-800 dark:text-stone-200'}`}>
                                                {member.name}
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() => toggleAssignee(member._id)}
                                                className="w-4 h-4 rounded accent-primary-500 cursor-pointer shrink-0"
                                            />
                                        </label>
                                    );
                                }) : (
                                    <div className="px-3 py-4 text-sm text-stone-400 text-center italic">No team members found</div>
                                )}
                            </div>
                        </div>
                        <Input
                            label="Due Date"
                            type="date"
                            name="dueDate"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                            Project (Optional)
                        </label>
                        <select
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        >
                            <option value="">Select a project...</option>
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Attachments Section */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                                Attachments
                            </label>
                            <label className="cursor-pointer text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
                                <Upload className="w-3 h-3" /> Add File
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </label>
                        </div>
                        {files.length > 0 && (
                            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm">
                                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate pr-4">{file.name}</span>
                                        <button type="button" onClick={() => removeFile(idx)} className="text-stone-400 hover:text-red-500 transition-colors shrink-0">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUploading}>
                            {isUploading ? 'Creating...' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
