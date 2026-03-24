import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Folder, FolderKanban, ChevronRight, Plus } from 'lucide-react';

const mockProjects = [
    { id: 'p1', name: 'Web App Revamp', status: 'Active', tasksCount: 12 },
    { id: 'p2', name: 'Design System', status: 'Planning', tasksCount: 5 },
];

const FolderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-[#0F172A] p-6 lg:p-8 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Workspace</span>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Engineering</span>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="font-semibold text-gray-900 dark:text-white">Frontend Folder</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white flex items-center gap-3">
                        <Folder className="w-8 h-8 text-yellow-500" />
                        Frontend Folder
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Manage all frontend related projects.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-primary-500 hover:from-yellow-600 hover:to-primary-600 text-white rounded-xl shadow-lg shadow-yellow-500/30 transition-all font-medium">
                    <Plus className="w-5 h-5 mr-2" />
                    New Project
                </button>
            </div>

            {/* Projects List */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm transition-colors duration-300">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>
                    <span className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-full">{mockProjects.length} Active</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/10">
                    {mockProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                            className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform group-hover:text-primary-500`}>
                                    <FolderKanban className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">{project.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.tasksCount} pending tasks</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                    {project.status}
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors group-hover:translate-x-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FolderDetails;
