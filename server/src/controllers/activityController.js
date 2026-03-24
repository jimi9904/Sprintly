const ActivityLog = require('../models/ActivityLog');
const Workspace = require('../models/Workspace');

const MAX_ACTIVITIES = 20;

// @desc    Get recent activity for user's workspace
// @route   GET /api/activity
// @access  Private
exports.getRecentActivity = async (req, res) => {
    try {
        // Find the workspace this user belongs to
        const workspace = await Workspace.findOne({
            $or: [{ owner: req.user.id }, { 'members.user': req.user.id }]
        });

        const query = workspace ? { workspaceId: workspace._id } : { user: req.user.id };

        const activities = await ActivityLog.find(query)
            .sort({ timestamp: -1 })
            .limit(MAX_ACTIVITIES)
            .populate('user', 'name');

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Log a new activity from the frontend
// @route   POST /api/activity
// @access  Private
exports.createActivity = async (req, res) => {
    try {
        const { action, entity, details } = req.body;

        // Find the workspace to scope the activity
        const workspace = await Workspace.findOne({
            $or: [{ owner: req.user.id }, { 'members.user': req.user.id }]
        });

        const newActivity = await ActivityLog.create({
            user: req.user.id,
            workspaceId: workspace?._id,
            action: action || '',
            entity: entity || '',
            details: details || ''
        });

        await newActivity.populate('user', 'name');

        // Enforce max 20 — delete oldest beyond the limit for this workspace
        if (workspace) {
            const count = await ActivityLog.countDocuments({ workspaceId: workspace._id });
            if (count > MAX_ACTIVITIES) {
                // Find IDs of oldest docs beyond the limit
                const oldest = await ActivityLog.find({ workspaceId: workspace._id })
                    .sort({ timestamp: 1 })
                    .limit(count - MAX_ACTIVITIES)
                    .select('_id');
                await ActivityLog.deleteMany({ _id: { $in: oldest.map(d => d._id) } });
            }
        }

        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Internal helper — called by other controllers (project, task, etc.)
exports.logActivity = async (user, action, entity, entityId, details, workspaceId) => {
    try {
        await ActivityLog.create({ user, action, entity, entityId, details, workspaceId });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};
