import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, Folder, ChevronRight, Plus } from 'lucide-react';

const mockFolders = [
    { id: 'f1', name: 'Frontend', projectsCount: 2, color: 'text-yellow-500' },
    { id: 'f2', name: 'Backend', projectsCount: 4, color: 'text-green-500' },
    { id: 'f3', name: 'Design', projectsCount: 1, color: 'text-purple-500' },
];

const SpaceDetails = () => {
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
                        <span className="font-semibold text-gray-900 dark:text-white">Engineering Space</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white flex items-center gap-3">
                        <LayoutGrid className="w-8 h-8 text-blue-500" />
                        Engineering Space
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Manage folders and projects within this space.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium">
                    <Plus className="w-5 h-5 mr-2" />
                    New Folder
                </button>
            </div>

            {/* Folders List */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm transition-colors duration-300">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Folders</h2>
                    <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">{mockFolders.length} Total</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/10">
                    {mockFolders.map((folder) => (
                        <div
                            key={folder.id}
                            onClick={() => navigate(`/dashboard/folders/${folder.id}`)}
                            className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-white/5 ${folder.color} group-hover:scale-110 transition-transform`}>
                                    <Folder className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{folder.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{folder.projectsCount} projects inside</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors group-hover:translate-x-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpaceDetails;
