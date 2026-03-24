import React from 'react';
import { useSelector } from 'react-redux';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell,
    RadialBarChart, RadialBar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Users, Layers, TrendingUp, PieChart as PieIcon, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

// Shared Tooltip Style
const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
};

const customTooltipStyleDark = {
    backgroundColor: 'rgba(28, 25, 23, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    color: '#fff'
};

export const TaskCompletionTrend = ({ data, loading }) => {
    const isDark = document.documentElement.classList.contains('dark');

    if (loading) return <div className="h-80 bg-stone-100 dark:bg-stone-800/50 rounded-xl animate-pulse"></div>;

    if (!data || data.length === 0) {
        return (
            <Card className="h-80 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 self-start w-full">Task Completion Trend</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                    <TrendingUp className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">No activity recorded for the past week.</p>
                </div>
            </Card>
        );
    }

    const chartData = data;

    return (
        <Card className="h-80 relative overflow-hidden group">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4 relative z-10">Task Completion Trend</h3>

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors"></div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#292524" : "#f5f5f4"} vertical={false} />
                    <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={isDark ? customTooltipStyleDark : customTooltipStyle} />
                    <Area type="monotone" dataKey="new" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} />
                    <Area type="monotone" dataKey="completed" stroke="#f97316" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export const ProjectProgressChart = ({ data, loading }) => {
    const isDark = document.documentElement.classList.contains('dark');

    if (loading) return <div className="h-80 bg-stone-100 dark:bg-stone-800/50 rounded-xl animate-pulse"></div>;

    if (!data || data.length === 0) {
        return (
            <Card className="h-80 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 self-start w-full">Project Progress %</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                    <div className="w-12 h-12 mb-3 opacity-20 border-2 border-dashed border-stone-400 rounded-full flex items-center justify-center font-bold text-xl">%</div>
                    <p className="text-sm">No active projects to track progress.</p>
                </div>
            </Card>
        );
    }

    // Use fetched data, map colors to it
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
    const chartData = data.map((item, index) => ({
        ...item,
        fill: colors[index % colors.length]
    }));

    return (
        <Card className="h-80 flex flex-col">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Project Progress %</h3>
            <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={15} data={data}>
                        <RadialBar
                            minAngle={15}
                            label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                            background={{ fill: isDark ? '#292524' : '#f5f5f4' }}
                            clockWise
                            dataKey="progress"
                            cornerRadius={10}
                        />
                        <Tooltip
                            contentStyle={isDark ? customTooltipStyleDark : customTooltipStyle}
                            formatter={(value) => [`${value}%`, 'Progress']}
                        />
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right"
                            formatter={(value) => <span className="text-stone-600 dark:text-stone-300 text-xs font-medium">{value}</span>}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export const OverdueBreakdownChart = ({ data, loading }) => {
    const isDark = document.documentElement.classList.contains('dark');

    if (loading) return <div className="h-80 bg-stone-100 dark:bg-stone-800/50 rounded-xl animate-pulse"></div>;

    if (!data || data.length === 0) {
        return (
            <Card className="h-80 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4 self-start w-full">Overdue Breakdown</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                    <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">No tasks available to track deadlines.</p>
                </div>
            </Card>
        );
    }

    const chartData = data;

    return (
        <Card className="h-80">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Overdue Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#292524" : "#f5f5f4"} vertical={false} />
                    <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={isDark ? customTooltipStyleDark : customTooltipStyle} cursor={{ fill: isDark ? '#292524' : '#f5f5f4' }} />
                    <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export const TeamProductivityChart = ({ data, loading }) => {
    const isDark = document.documentElement.classList.contains('dark');

    if (loading) return <div className="h-80 bg-stone-100 dark:bg-stone-800/50 rounded-xl animate-pulse"></div>;

    if (!data || data.length === 0) {
        return (
            <Card className="h-80 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 self-start w-full">Team Productivity</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                    <Users className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">Assign tasks to team members to see productivity metrics.</p>
                </div>
            </Card>
        );
    }

    // Use fetched data instead of mock data
    const chartData = data;

    // Extract user keys (e.g., 'A', 'B', or actual names) from the first data point, excluding 'subject' and 'fullMark'
    const userKeys = Object.keys(chartData[0]).filter(key => key !== 'subject' && key !== 'fullMark');
    const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

    return (
        <Card className="h-80">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Team Productivity</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke={isDark ? "#44403c" : "#e7e5e4"} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#a8a29e' : '#78716c', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    {userKeys.map((key, index) => (
                        <Radar
                            key={key}
                            name={key}
                            dataKey={key}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.3}
                        />
                    ))}
                    <Tooltip contentStyle={isDark ? customTooltipStyleDark : customTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RadarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export const WorkloadDistributionChart = ({ data, loading }) => {
    const isDark = document.documentElement.classList.contains('dark');

    if (loading) return <div className="h-80 bg-stone-100 dark:bg-stone-800/50 rounded-xl animate-pulse"></div>;

    if (!data || data.length === 0) {
        return (
            <Card className="h-80 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 self-start w-full">Workload Distribution</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                    <PieIcon className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">Assign tasks to team members to see workloads.</p>
                </div>
            </Card>
        );
    }

    const colors = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#78716c'];

    const chartData = data.map((item, index) => ({
        ...item,
        color: colors[index % colors.length]
    }));

    const totalTasks = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <Card className="h-80 flex flex-col">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Workload Distribution</h3>
            <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={isDark ? customTooltipStyleDark : customTooltipStyle}
                            itemStyle={{ color: '#44403c', fontWeight: '500' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={40}
                            iconType="circle"
                            formatter={(value, entry) => <span className="text-stone-600 dark:text-stone-300 text-xs font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                    <span className="text-2xl font-bold text-stone-900 dark:text-white block">{totalTasks}</span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Tasks</span>
                </div>
            </div>
        </Card>
    );
};
