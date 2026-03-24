const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * @desc    Global text search across Tasks and Projects, with optional filters
 * @route   GET /api/search
 * @access  Private
 */
exports.globalSearch = async (req, res) => {
    try {
        const { q, status, assignee, priority, startDate, endDate, workspaceId } = req.query;

        // Base text search query
        let textQuery = {};
        if (q && q.trim() !== '') {
            textQuery = { $text: { $search: q } };
        }

        // --- PROJECTS SEARCH ---
        // If workspaceId is provided, scope projects to it
        let projectFilter = { ...textQuery };
        if (workspaceId) projectFilter.workspaceId = workspaceId;

        // We only fetch projects if there are no task-specific filters applied
        // (If user filters by 'todo' status or 'high' priority, they probably only want tasks)
        let projects = [];
        if (!status && !assignee && !priority && !startDate && !endDate) {
            projects = await Project.find(projectFilter)
                .select('name description status workspaceId')
                .limit(10)
                .lean();
        }

        // --- TASKS SEARCH ---
        let taskFilter = { ...textQuery };

        // Scope to workspace/projects
        // If we want to scope tasks by workspaceId, we first find projects in that workspace
        if (workspaceId) {
            const workspaceProjects = await Project.find({ workspaceId }).select('_id');
            const projectIds = workspaceProjects.map(p => p._id);
            taskFilter.project = { $in: projectIds };
        }

        // Apply specific filters
        if (status) {
            taskFilter.status = { $in: status.split(',') };
        }
        if (priority) {
            taskFilter.priority = { $in: priority.split(',') };
        }
        if (assignee) {
            // Task schema updated to "assignees" array 
            taskFilter.assignees = { $in: assignee.split(',') };
        }
        if (startDate || endDate) {
            taskFilter.dueDate = {};
            if (startDate) taskFilter.dueDate.$gte = new Date(startDate);
            if (endDate) taskFilter.dueDate.$lte = new Date(endDate);
        }

        const tasks = await Task.find(taskFilter)
            .select('title status priority dueDate project')
            .populate('project', 'name')
            .limit(20)
            .lean();

        res.status(200).json({
            success: true,
            data: {
                projects,
                tasks
            }
        });

    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ success: false, message: 'Server error during search' });
    }
};
