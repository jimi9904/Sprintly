import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../redux/slices/projectSlice';
import { addActivity } from '../../redux/slices/activitySlice';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Let the backend handle ID, status, and creation date
        dispatch(createProject({
            name: formData.name,
            description: formData.description
        }));

        onClose();
        setFormData({
            name: '',
            description: ''
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">Create New Project</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <Input
                        label="Project Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Website Redesign"
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
                            placeholder="Project goals and details..."
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
