import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProject, deleteProject } from '../../redux/slices/projectSlice';
import { getTasks, createTask } from '../../redux/slices/taskSlice';
import {
    Plus, Trash, CheckCircle, Clock, X, MessageSquare,
    Activity, LayoutList, Calendar, User, MoreHorizontal, Send
} from 'lucide-react';
import { openTaskDrawer } from '../../redux/slices/uiSlice';
import CreateTaskModal from '../dashboard/CreateTaskModal';

// Mock Data for Task Details
const mockSubtasks = [
    { id: 'st1', title: 'Design database schema', done: true },
    { id: 'st2', title: 'Setup API routes', done: false },
    { id: 'st3', title: 'Write unit tests', done: false },
];

const mockComments = [
    { id: 'c1', user: 'Alex M.', text: 'I started working on the frontend integration.', time: '2 hours ago' },
    { id: 'c2', user: 'Sarah K.', text: 'Looks good! Make sure to check the new design files.', time: '1 hour ago' },
];

const mockActivity = [
    { id: 'a1', action: 'changed status to In Progress', time: 'Yesterday at 4:00 PM' },
    { id: 'a2', action: 'assigned to Sarah K.', time: 'Yesterday at 3:30 PM' },
    { id: 'a3', action: 'created this task', time: 'Oct 12 at 10:00 AM' },
];

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentProject, loading: projectLoading } = useSelector((state) => state.projects);
    const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        dispatch(getProject(id));
        dispatch(getTasks(id));
    }, [dispatch, id]);

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await dispatch(deleteProject(id));
            navigate('/dashboard/projects');
        }
    };



    if (projectLoading || !currentProject) return <div className="p-6">Loading project details...</div>;

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden relative">

            {/* Main Content Area */}
            <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${selectedTask ? 'mr-[400px]' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-1">{currentProject.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400">{currentProject.description}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDeleteProject}
                            className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
                        >
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </button>
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 rounded-xl transition-all font-medium text-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Task
                        </button>
                    </div>
                </div>

                <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

                <div className="space-y-3">
                    {tasksLoading ? <div className="text-slate-500">Loading tasks...</div> : tasks.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400">
                            No tasks yet. Create your first task to get started!
                        </div>
                    ) : tasks.map((task) => (
                        <div
                            key={task._id}
                            onClick={() => dispatch(openTaskDrawer(task._id))}
                            className={`group p-4 rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-800 ${selectedTask?._id === task._id
                                ? 'border-blue-500 shadow-md shadow-blue-500/10'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${task.status === 'done' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                                    {task.status === 'done' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className={`font-semibold text-lg ${task.status === 'done' ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1"><LayoutList className="w-3.5 h-3.5" /> 3 Subtasks</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 2 Comments</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${task.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide-over Task Side Panel */}
            <div className={`absolute top-0 right-0 h-full w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 transform flex flex-col ${selectedTask ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedTask && (
                    <>
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-4">Task Details</h2>
                            <button onClick={() => setSelectedTask(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Title & Description */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedTask.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedTask.description || 'No description provided.'}</p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><User className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Unassigned</span>
                                </div>
                                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">No due date</span>
                                </div>
                            </div>

                            {/* Subtasks */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><LayoutList className="w-4 h-4 text-blue-500" /> Subtasks</h4>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 font-medium">1/3 Done</span>
                                </div>
                                <div className="space-y-2">
                                    {mockSubtasks.map(st => (
                                        <div key={st.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group transition-colors">
                                            <input type="checkbox" defaultChecked={st.done} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                            <span className={`text-sm flex-1 ${st.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{st.title}</span>
                                        </div>
                                    ))}
                                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-2 hover:underline">
                                        <Plus className="w-4 h-4" /> Add Subtask
                                    </button>
                                </div>
                            </div>

                            {/* Activity & Comments Tabs */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-orange-500" /> Activity Log</h4>
                                <div className="space-y-4">
                                    {mockActivity.map(act => (
                                        <div key={act.id} className="flex gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0"></div>
                                            <div>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">Someone <span className="font-semibold">{act.action}</span></p>
                                                <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 pb-6">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><MessageSquare className="w-4 h-4 text-green-500" /> Comments</h4>
                                <div className="space-y-4 mb-4">
                                    {mockComments.map(c => (
                                        <div key={c.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl rounded-tl-none border border-slate-100 dark:border-slate-700/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">{c.user}</span>
                                                <span className="text-[10px] text-slate-400">{c.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button className={`absolute right-1.5 top-1.5 p-1.5 rounded-full ${commentText ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'} transition-colors`}>
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default ProjectDetails;
