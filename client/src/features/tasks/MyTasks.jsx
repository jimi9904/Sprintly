import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Search, ChevronDown } from 'lucide-react';
import Card from '../../components/ui/Card';
import { openTaskDrawer } from '../../redux/slices/uiSlice';
import { updateTask } from '../../redux/slices/taskSlice';

const STATUSES = [
    { value: 'todo', label: 'To Do', color: 'text-stone-600  dark:text-stone-300', bg: 'bg-stone-100  dark:bg-stone-700', dot: 'bg-stone-400' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-700   dark:text-blue-300', bg: 'bg-blue-100   dark:bg-blue-900/40', dot: 'bg-blue-500' },
    { value: 'review', label: 'Review', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/40', dot: 'bg-purple-500' },
    { value: 'done', label: 'Done', color: 'text-green-700  dark:text-green-300', bg: 'bg-green-100  dark:bg-green-900/40', dot: 'bg-green-500' },
];

const StatusDropdown = ({ task }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = STATUSES.find(s => s.value === task.status) || STATUSES[0];

    useEffect(() => {
        const handleOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    return (
        <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${current.bg} ${current.color} hover:opacity-80`}
            >
                <span className={`w-2 h-2 rounded-full ${current.dot} shrink-0`} />
                {current.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-1.5 w-40 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl z-50 overflow-hidden"
                    >
                        {STATUSES.map(s => (
                            <button
                                key={s.value}
                                onClick={() => {
                                    dispatch(updateTask({ id: task._id, taskData: { status: s.value } }));
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-stone-50 dark:hover:bg-stone-800
                                    ${s.value === task.status ? 'bg-stone-50 dark:bg-stone-800' : ''}
                                    ${s.color}
                                `}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full ${s.dot} shrink-0`} />
                                {s.label}
                                {s.value === task.status && (
                                    <span className="ml-auto text-xs opacity-60">✓</span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MyTasks = () => {
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const FILTER_TABS = [
        { value: 'all', label: 'All' },
        { value: 'todo', label: 'Todo' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'Review' },
        { value: 'done', label: 'Done' },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-white font-display">My Tasks</h1>
                    <p className="text-stone-500 dark:text-stone-400">View and manage your assigned tasks.</p>
                </div>
            </motion.div>

            <div data-aos="fade-up" data-aos-delay="80">
                <Card className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border-none focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 dark:text-white text-sm"
                            />
                        </div>
                        {/* Filter tabs */}
                        <div className="flex gap-1.5 flex-wrap">
                            {FILTER_TABS.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => setFilterStatus(tab.value)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === tab.value
                                        ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 text-stone-400"
                                >
                                    <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No tasks found.</p>
                                    <p className="text-sm mt-1 opacity-70">Try adjusting your filters.</p>
                                </motion.div>
                            ) : (
                                filteredTasks.map((task) => (
                                    <motion.div
                                        key={task._id}
                                        layout
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        className="px-4 py-3.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-800/50 hover:border-primary-500/40 hover:shadow-sm transition-all cursor-pointer group"
                                        onClick={() => dispatch(openTaskDrawer(task._id))}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Left: title + meta */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-semibold text-stone-900 dark:text-white truncate ${task.status === 'done' ? 'line-through text-stone-400 dark:text-stone-500' : ''}`}>
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center gap-2.5 mt-1.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${task.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                        task.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                            task.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                                                'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                    <span className="text-xs text-stone-400 dark:text-stone-500">
                                                        {task.dueDate
                                                            ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                            : 'No due date'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right: custom status dropdown */}
                                            <StatusDropdown task={task} />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyTasks;

