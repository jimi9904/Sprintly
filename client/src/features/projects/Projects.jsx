import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProject } from '../../redux/slices/projectSlice';
import { Link } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Projects = () => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector((state) => state.projects);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createError, setCreateError] = useState(null);

    useEffect(() => {
        dispatch(getProjects());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setCreateError(null);
        try {
            await dispatch(createProject(formData)).unwrap();
            setIsCreating(false);
            setFormData({ name: '', description: '' });
        } catch (err) {
            setCreateError(err || 'Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <div className="space-y-6">
            <div data-aos="fade-up" data-aos-delay="0" className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Projects</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your projects and track progress.</p>
                </div>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    <Plus className="w-5 h-5 mr-2" />
                    New Project
                </Button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Create New Project</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Project Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                {createError && <p className="text-sm text-red-500">{createError}</p>}
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
                                    <Button type="submit" isLoading={isSubmitting}>Create Project</Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="text-center py-10">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No projects found. Create one to get started!</div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {projects.map((project, idx) => (
                        <motion.div key={project._id} variants={itemVariants}
                            data-aos="zoom-in"
                            data-aos-delay={idx * 60}
                        >
                            <Link to={`/dashboard/projects/${project._id}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-primary-500 p-6 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{project.name}</h3>
                                    <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-2">{project.description || 'No description provided.'}</p>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Projects;
