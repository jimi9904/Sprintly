const Task = require('../models/Task');
const Project = require('../models/Project');
const Workspace = require('../models/Workspace');
const NodeCache = require('node-cache');

// Initialize cache with 5 minutes TTL (Time To Live)
const statsCache = new NodeCache({ stdTTL: 300 });

/**
 * @desc    Get dashboard aggregated stats (Progress, Trends, Workload, Overdue)
 * @route   GET /api/stats/dashboard
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
    try {
        let workspaceId = req.query.workspaceId;

        // Auto-resolve workspace if not explicitly provided
        if (!workspaceId || workspaceId === 'undefined') {
            const workspace = await Workspace.findOne({
                $or: [
                    { owner: req.user.id },
                    { 'members.user': req.user.id }
                ]
            });

            if (!workspace) {
                return res.status(200).json({
                    success: true,
                    data: { completionTrend: [], projectProgress: [], workloadDistribution: [], overdueBreakdown: [], teamProductivity: [] },
                    cached: false
                });
            }
            workspaceId = workspace._id.toString();
        }

        // Check Cache First
        const cacheKey = `dashboard_stats_${workspaceId}`;
        const cachedData = statsCache.get(cacheKey);
        if (cachedData) {
            console.log('⚡ Serving Dashboard Stats from Cache');
            return res.status(200).json({ success: true, data: cachedData, cached: true });
        }

        // Fetch all projects in the workspace to scope tasks
        const projects = await Project.find({ workspaceId }).select('_id name');
        const projectIds = projects.map(p => p._id);

        if (projectIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: { completionTrend: [], projectProgress: [], workloadDistribution: [], overdueBreakdown: [] }
            });
        }

        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        const taskMatchQuery = {
            $or: [
                { project: { $in: projectIds } },
                { assignees: req.user.id }
            ]
        };

        const [
            completionTrend,
            projectProgress,
            workloadDistribution,
            overdueBreakdown,
            teamProductivityData,
            activeProjectsCount,
            taskStatusCounts,
            overdueTasksCount,
            urgentTasksCount
        ] = await Promise.all([
            // 1. Task Completion Trend (last 7 days grouped by date)
            Task.aggregate([
                {
                    $match: {
                        ...taskMatchQuery,
                        createdAt: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        created: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
                    }
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        created: 1,
                        completed: 1
                    }
                }
            ]),

            // 2. Project Progress % (Standalone tasks will naturally fail the lookup or grouping, which is fine, but they count towards overall)
            Task.aggregate([
                { $match: taskMatchQuery },
                {
                    $group: {
                        _id: "$project",
                        totalTasks: { $sum: 1 },
                        completedTasks: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
                    }
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "_id",
                        foreignField: "_id",
                        as: "projectData"
                    }
                },
                { $unwind: { path: "$projectData", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        name: { $ifNull: ["$projectData.name", "Standalone Tasks"] },
                        progress: {
                            $cond: [
                                { $eq: ["$totalTasks", 0] },
                                0,
                                { $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100] }
                            ]
                        }
                    }
                },
                { $sort: { progress: -1 } },
                { $limit: 5 } // Top 5 projects
            ]),

            // 3. Workload Distribution (Count active tasks per assignee)
            Task.aggregate([
                { $match: { ...taskMatchQuery, status: { $ne: "done" } } },
                { $unwind: "$assignees" },
                {
                    $group: {
                        _id: "$assignees",
                        taskCount: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        name: { $ifNull: ["$userData.name", "Unassigned"] },
                        taskCount: 1
                    }
                },
                { $sort: { taskCount: -1 } }
            ]),

            // 4. Overdue Breakdown (On Time vs Overdue vs Urgent)
            Task.aggregate([
                { $match: { ...taskMatchQuery, status: { $ne: "done" } } },
                {
                    $group: {
                        _id: null,
                        overdue: { $sum: { $cond: [{ $and: [{ $ne: ["$dueDate", null] }, { $lt: ["$dueDate", now] }] }, 1, 0] } },
                        onTime: { $sum: { $cond: [{ $and: [{ $ne: ["$dueDate", null] }, { $gte: ["$dueDate", now] }] }, 1, 0] } },
                        urgent: { $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        overdue: 1,
                        onTime: 1,
                        urgent: 1
                    }
                }
            ]),

            // 5. Team Productivity (Radar Chart Data)
            Task.aggregate([
                { $match: { ...taskMatchQuery, assignees: { $exists: true, $not: { $size: 0 } } } },
                { $unwind: "$assignees" },
                {
                    $group: {
                        _id: "$assignees",
                        tasksDone: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
                        tasksTotal: { $sum: 1 },
                        speed: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $eq: ["$status", "done"] }, { $gte: ["$dueDate", "$updatedAt"] }] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
                {
                    // For the radar chart, we want data pivoted where each object is a metric (subject) and users are keys
                    // But in aggregation it's easier to collect user stats and pivot in JS
                    $project: {
                        _id: 0,
                        name: { $ifNull: ["$userData.name", "Unassigned"] },
                        tasksDone: 1,
                        speed: 1,
                        quality: { $multiply: [{ $rand: {} }, 50] }, // Simulated quality score
                        review: { $multiply: [{ $rand: {} }, 50] }, // Simulated review score
                        participation: "$tasksTotal"
                    }
                },
                { $limit: 3 } // Limit to 3 top users for radar clarity
            ]),

            // 6. Active Projects Count
            Project.countDocuments({ workspaceId, status: 'active' }),

            // 7. Task Status Counts
            Task.aggregate([
                { $match: taskMatchQuery },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // 8. Overdue Tasks Count
            Task.countDocuments({
                ...taskMatchQuery,
                status: { $ne: 'done' },
                dueDate: { $lt: new Date() }
            }),

            // 9. Urgent Tasks Count
            Task.countDocuments({
                ...taskMatchQuery,
                status: { $ne: 'done' },
                priority: 'urgent'
            })
        ]);

        // Pivot Team Productivity for Radar Chart
        // Expected Radar format: [{ subject: 'Tasks Done', 'User1': 10, 'User2': 5, fullMark: 100 }, ...]
        let teamProductivity = [];
        if (teamProductivityData && teamProductivityData.length > 0) {
            const subjects = [
                { key: 'tasksDone', label: 'Tasks Done', max: 50 },
                { key: 'speed', label: 'Speed', max: 50 },
                { key: 'quality', label: 'Quality', max: 50 },
                { key: 'review', label: 'Review', max: 50 },
                { key: 'participation', label: 'Participation', max: 50 }
            ];

            teamProductivity = subjects.map(sub => {
                const row = { subject: sub.label, fullMark: sub.max };
                teamProductivityData.forEach(userStat => {
                    const firstName = userStat.name.split(' ')[0];
                    row[firstName] = userStat[sub.key] || 0;
                    if (sub.key === 'quality' || sub.key === 'review') row[firstName] += 50; // offset simulated data
                });
                return row;
            });
        }

        let pendingTasks = 0;
        let completedTasks = 0;

        taskStatusCounts.forEach(group => {
            if (group._id === 'done') {
                completedTasks = group.count;
            } else if (group._id === 'todo' || group._id === 'in-progress') {
                pendingTasks += group.count;
            }
        });

        const responseData = {
            topLevelMetrics: {
                activeProjects: activeProjectsCount,
                completedTasks,
                pendingTasks,
                overdueTasks: overdueTasksCount,
                urgentTasks: urgentTasksCount
            },
            completionTrend,
            projectProgress: projectProgress.map(p => ({ name: p.name, value: Math.round(p.progress) })),
            workloadDistribution: workloadDistribution.map(w => ({ name: w.name, value: w.taskCount })),
            teamProductivity,
            overdueBreakdown: overdueBreakdown.length > 0 ? [
                { name: 'Overdue', value: overdueBreakdown[0].overdue, color: '#ef4444' },
                { name: 'On Time', value: overdueBreakdown[0].onTime, color: '#22c55e' },
                { name: 'Urgent', value: overdueBreakdown[0].urgent, color: '#f97316' }
            ] : []
        };

        // Save to Cache
        statsCache.set(cacheKey, responseData);

        res.status(200).json({ success: true, data: responseData, cached: false });

    } catch (err) {
        console.error('Stats aggregation error:', err);
        res.status(500).json({ success: false, message: 'Server error crunching stats' });
    }
};

/**
 * Helper to manually invalidate clear a workspace's cache block
 * Should be called by Task/Project controllers after mutations
 */
exports.invalidateCache = (workspaceId) => {
    if (workspaceId) {
        statsCache.del(`dashboard_stats_${workspaceId}`);
        console.log(`🧹 Cleared cache cache for workspace: ${workspaceId}`);
    }
};
