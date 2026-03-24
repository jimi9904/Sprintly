import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../redux/slices/projectSlice';
import { getAllUserTasks } from '../../redux/slices/taskSlice';
import { fetchWorkspaceData } from '../../redux/slices/authSlice';
import { fetchActivities } from '../../redux/slices/activitySlice';
import dashboardService from '../../services/dashboardService';
import { Layers, CheckCircle, Clock, AlertCircle, Plus, UserPlus, Upload, FileText, Zap, ChevronRight, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TaskCompletionTrend = React.lazy(() => import('./DashboardCharts').then(module => ({ default: module.TaskCompletionTrend })));
const TeamProductivityChart = React.lazy(() => import('./DashboardCharts').then(module => ({ default: module.TeamProductivityChart })));
import RecentActivity from './RecentActivity';
import TaskTable from './TaskTable';
import CreateTaskModal from './CreateTaskModal';
import InviteMemberModal from '../team/InviteMemberModal';
import CreateTeamModal from '../team/CreateTeamModal';
import CreateProjectModal from './CreateProjectModal';

const DashboardHome = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
    const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    // Dashboard Stats State
    const [statsData, setStatsData] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        dispatch(getProjects());
        dispatch(getAllUserTasks());
        dispatch(fetchWorkspaceData());
        dispatch(fetchActivities());
    }, [dispatch]);

    useEffect(() => {
        const handleOpenTaskModal = () => setIsTaskModalOpen(true);
        document.addEventListener('open-add-task-modal', handleOpenTaskModal);
        return () => document.removeEventListener('open-add-task-modal', handleOpenTaskModal);
    }, []);

    // Fetch Aggregated Dashboard Stats instead of computing on client
    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                // Only set loading to true if we don't have stats yet, to prevent flashing on background socket updates
                if (!statsData) setStatsLoading(true);
                const response = await dashboardService.getDashboardStats();
                setStatsData(response.data.data); // Unwrap the backend's { success: true, data: {...} }
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();

        // Listen for task changes via standard Redux state updates, but also hook
        // into socket events if we want immediate localized re-fetching for metrics
        const handleTasksUpdated = () => {
            fetchStats();
        };

        window.addEventListener('tasks-updated', handleTasksUpdated);
        return () => window.removeEventListener('tasks-updated', handleTasksUpdated);

    }, [user, tasks]);

    // Top Level Metric cards now pulled securely from backend aggregation (statsData), 
    // ensuring accuracy even when tasks exist on page 2+ of the table pagination
    const activeProjects = statsData?.topLevelMetrics?.activeProjects || 0;
    const completedTasks = statsData?.topLevelMetrics?.completedTasks || 0;
    const pendingTasks = statsData?.topLevelMetrics?.pendingTasks || 0;
    const urgentTasks = statsData?.topLevelMetrics?.urgentTasks || 0;

    const stats = [
        { label: 'Active Projects', value: statsLoading ? '-' : activeProjects, icon: Layers, trend: '+12%', trendUp: true, color: 'text-primary-500' },
        { label: 'Completed Tasks', value: statsLoading ? '-' : completedTasks, icon: CheckCircle, trend: '+8%', trendUp: true, color: 'text-emerald-500' },
        { label: 'Pending Tasks', value: statsLoading ? '-' : pendingTasks, icon: Clock, trend: '-2%', trendUp: false, color: 'text-amber-500' },
        { label: 'Urgent Tasks', value: statsLoading ? '-' : urgentTasks, icon: AlertCircle, trend: '+0%', trendUp: false, color: 'text-orange-500' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, filter: 'blur(5px)' },
        visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <div className="relative min-h-screen pb-10 overflow-x-hidden">

            <motion.div
                className="relative z-10 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
                <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
                <CreateTeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
                <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />

                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white font-display tracking-tight">
                            Dashboard Overview
                        </h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">
                            Welcome back, <span className="text-primary-500 font-bold">{user?.name}</span> 👋
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4 md:mt-0">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsProjectModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all text-sm font-semibold"
                        >
                            <Plus className="w-5 h-5" /> New Project
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="relative overflow-hidden bg-white/60 dark:bg-stone-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-white/5 shadow-sm transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{stat.label}</p>
                                    <h3 className="text-4xl font-bold text-stone-800 dark:text-white mt-2 tracking-tight">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ${stat.glow} shadow-sm`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                                    {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                    {stat.trend}
                                </span>
                                <span className="text-xs text-stone-400">from last week</span>
                            </div>

                            {/* Decorative Background */}
                            <div className={`absolute -bottom-4 -right-4 opacity-5 pointer-events-none transform -rotate-12 scale-150`}>
                                <stat.icon className={`w-32 h-32 ${stat.color}`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions - Feature Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Create Task', icon: CheckCircle, from: 'from-blue-500', to: 'to-blue-600', shadow: 'shadow-blue-500/20', action: () => setIsTaskModalOpen(true), desc: 'Add a new task to your board' },
                        { label: 'Create Team', icon: Users, from: 'from-emerald-500', to: 'to-emerald-600', shadow: 'shadow-emerald-500/20', action: () => setIsTeamModalOpen(true), desc: 'Group members into departments' },
                        { label: 'Invite Member', icon: UserPlus, from: 'from-purple-500', to: 'to-purple-600', shadow: 'shadow-purple-500/20', action: () => setIsInviteModalOpen(true), desc: 'Grow your team and collaborate' },
                    ].map((btn, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={btn.action}
                            className={`
                                relative overflow-hidden rounded-3xl p-6 text-left h-48 flex flex-col justify-between
                                bg-gradient-to-br ${btn.from} ${btn.to}
                                shadow-lg ${btn.shadow} group transition-all
                            `}
                        >
                            {/* Decorative Big Icon */}
                            <btn.icon className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />

                            <div className="relative z-10 bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <btn.icon className="w-6 h-6 text-white" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                                    {btn.label}
                                </h3>
                                <p className="text-white/80 text-sm font-medium line-clamp-2">
                                    {btn.desc}
                                </p>
                            </div>

                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Full Width Task Table */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl mt-8 mb-8 relative z-20">
                    <div className="p-6 border-b border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-primary-500" /> All Tasks
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-stone-500 dark:text-stone-400 font-medium">{tasksLoading ? '-' : tasks.length} total tasks</span>
                        </div>
                    </div>
                    <div className="p-0">
                        {tasksLoading ? (
                            <div className="p-8 text-center text-stone-500">Loading tasks...</div>
                        ) : (
                            <TaskTable tasks={tasks} />
                        )}
                    </div>
                </motion.div>

                {/* Main Content Area — Team Productivity + Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column — Team Productivity */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <React.Suspense fallback={<div className="h-64 flex items-center justify-center bg-stone-50 dark:bg-stone-800/50 rounded-xl animate-pulse text-stone-400 text-sm">Loading Chart...</div>}>
                            <div className="glass-card rounded-2xl p-4">
                                <TeamProductivityChart data={statsData?.teamProductivity} loading={statsLoading} />
                            </div>
                        </React.Suspense>
                    </motion.div>

                    {/* Right Column — Activity Feed */}
                    <motion.div variants={itemVariants}>
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <RecentActivity />
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
};

export default DashboardHome;
