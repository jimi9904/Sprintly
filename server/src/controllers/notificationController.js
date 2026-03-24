const Notification = require('../models/Notification');
const Workspace = require('../models/Workspace');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept a workspace invite
// @route   POST /api/notifications/:id/accept
// @access  Private
exports.acceptInvite = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (notification.type !== 'workspace_invite') {
            return res.status(400).json({ message: 'This notification is not an invite' });
        }

        const { workspaceId } = notification.metadata;

        // Update the workspace member status from 'pending' to 'joined'
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const member = workspace.members.find(
            m => m.user.toString() === req.user.id
        );

        if (!member) {
            return res.status(404).json({ message: 'You are not listed in this workspace' });
        }

        member.status = 'joined';
        await workspace.save();

        // Mark notification as read
        notification.read = true;
        await notification.save();

        res.status(200).json({ message: 'Invite accepted', workspace: workspace.name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Decline a workspace invite
// @route   POST /api/notifications/:id/decline
// @access  Private
exports.declineInvite = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (notification.type !== 'workspace_invite') {
            return res.status(400).json({ message: 'This notification is not an invite' });
        }

        const { workspaceId } = notification.metadata;

        // Remove the user from the workspace entirely
        const workspace = await Workspace.findById(workspaceId);
        if (workspace) {
            workspace.members = workspace.members.filter(
                m => m.user.toString() !== req.user.id
            );
            await workspace.save();
        }

        // Delete the notification
        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Invite declined' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
