const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Get all workspaces for the logged in user
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        }).populate('members.user', 'name email avatar');

        res.status(200).json(workspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all members (global) + teams the user belongs to
// @route   GET /api/workspaces/members
// @access  Private
exports.getMembers = async (req, res) => {
    try {
        // ── ALL workspaces in the system (for the global member list) ──────────
        const allWorkspaces = await Workspace.find({})
            .populate('members.user', 'name email avatar role');

        // ── Deduplicated list of every user across every workspace ─────────────
        const seenIds = new Set();
        const allMembers = [];
        allWorkspaces.forEach(ws => {
            ws.members.forEach(m => {
                if (!m.user) return;
                const id = m.user._id.toString();
                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allMembers.push({
                        _id: m.user._id,
                        name: m.user.name,
                        email: m.user.email,
                        avatar: m.user.avatar || null,
                        role: m.role,
                        teams: m.teams || [],
                    });
                }
            });
        });

        // ── Workspaces the current user belongs to (owner or member) ──────────
        const myWorkspaces = await Workspace.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        }).populate('members.user', 'name email avatar role');

        // Auto-create a workspace if the user has absolutely none
        if (myWorkspaces.length === 0) {
            const newWs = await Workspace.create({
                name: `${req.user.name}'s Workspace`,
                owner: req.user.id,
                members: [{ user: req.user.id, role: 'admin', teams: ['Owner'], status: 'joined' }]
            });
            await newWs.populate('members.user', 'name email avatar role');
            myWorkspaces.push(newWs);
        }

        // ── Collect teams the current user is tagged in ────────────────────────
        const teamsMap = {}; // teamName → { myRole, members[] }

        myWorkspaces.forEach(ws => {
            // Find the current user's membership entry in this workspace
            const myMembership = ws.members.find(
                m => m.user && m.user._id.toString() === req.user.id.toString()
            );
            if (!myMembership) return;

            // Role in this workspace — owner always = admin
            const myRole = ws.owner.toString() === req.user.id.toString()
                ? 'admin'
                : myMembership.role;

            // Only include teams the user is actually tagged in (skip 'Owner' tag)
            const userTeams = (myMembership.teams || []).filter(t => t !== 'Owner');

            userTeams.forEach(teamName => {
                if (!teamsMap[teamName]) {
                    teamsMap[teamName] = { teamName, myRole: 'member', members: [] };
                }
                // Promote to admin if user owns this workspace
                if (myRole === 'admin') teamsMap[teamName].myRole = 'admin';

                // Add all workspace members who share this team tag
                ws.members.forEach(m => {
                    if (!m.user) return;
                    if (!(m.teams || []).includes(teamName)) return;
                    const already = teamsMap[teamName].members.some(
                        x => x._id.toString() === m.user._id.toString()
                    );
                    if (!already) {
                        teamsMap[teamName].members.push({
                            _id: m.user._id,
                            name: m.user.name,
                            email: m.user.email,
                            avatar: m.user.avatar || null,
                            role: m.role,
                            teams: m.teams || [],
                        });
                    }
                });
            });
        });

        res.status(200).json({
            allMembers,
            myTeams: Object.values(teamsMap),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Invite a member to workspace
// @route   POST /api/workspaces/invite
// @access  Private
exports.inviteMember = async (req, res) => {
    try {
        const { email, role, team } = req.body;

        // Try to find the user by email
        let userToInvite = await User.findOne({ email });

        // If the user doesn't exist in the DB, create a placeholder/invited user.
        // In a real system, we'd send an email invite, but we'll mock creating them.
        if (!userToInvite) {
            userToInvite = await User.create({
                name: email.split('@')[0],
                email,
                password: 'Password123!', // Dummy password
                role: 'user',
                isVerified: false
            });
        }

        // Find the inviter's OWN workspace first; fall back to one they belong to
        let workspace = await Workspace.findOne({ owner: req.user.id });

        if (!workspace) {
            workspace = await Workspace.findOne({ 'members.user': req.user.id });
        }

        // Auto-create a workspace if the user somehow doesn't have one
        if (!workspace) {
            workspace = await Workspace.create({
                name: `${req.user.name}'s Workspace`,
                owner: req.user.id,
                members: [{ user: req.user.id, role: 'admin', teams: ['Owner'], status: 'joined' }]
            });
        }

        // Check if user is already in the workspace
        const existingMember = workspace.members.find(
            m => m.user.toString() === userToInvite._id.toString()
        );

        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member of this workspace' });
        }

        // Add them to the workspace as pending
        workspace.members.push({
            user: userToInvite._id,
            role: role || 'member',
            teams: team ? [team] : [],
            status: 'pending' // They must accept the invite
        });

        await workspace.save();

        // Generate a Notification for the invited user
        const Notification = require('../models/Notification');
        const notification = await Notification.create({
            userId: userToInvite._id,
            title: 'Workspace Invitation',
            message: `${req.user.name || 'Someone'} has invited you to join their workspace.`,
            type: 'workspace_invite',
            metadata: {
                workspaceId: workspace._id,
                workspaceName: workspace.name,
                role: role || 'member',
                teams: team ? [team] : [],
                inviterName: req.user.name || 'Someone'
            }
        });

        // Emit real-time socket event if they are online
        const io = req.app.locals.io;
        if (io) {
            io.to(userToInvite._id.toString()).emit('notification:new', notification);
        }

        const populatedWorkspace = await Workspace.findById(workspace._id)
            .populate('members.user', 'name email avatar role');

        const newMember = populatedWorkspace.members.find(
            m => m.user._id.toString() === userToInvite._id.toString()
        );

        res.status(200).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new department
// @route   POST /api/workspaces/departments
// @access  Private
exports.createDepartment = async (req, res) => {
    try {
        const { name, description, selectedMembers } = req.body;

        // Prefer the workspace the user owns
        let workspace = await Workspace.findOne({ owner: req.user.id });
        if (!workspace) {
            workspace = await Workspace.findOne({ 'members.user': req.user.id });
        }

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Add department specifically (We'll update the Workspace schema next to support this)
        if (!workspace.departments) {
            workspace.departments = [];
        }

        if (!workspace.departments.includes(name)) {
            workspace.departments.push(name);
        }

        // Assign selected members to this team/department (additive, not overwrite)
        if (selectedMembers && selectedMembers.length > 0) {
            workspace.members = workspace.members.map(member => {
                if (selectedMembers.includes(member.user.toString())) {
                    const currentTeams = member.teams || [];
                    if (!currentTeams.includes(name)) {
                        return { ...member.toObject(), teams: [...currentTeams, name] };
                    }
                }
                return member;
            });
        }

        await workspace.save();

        res.status(200).json({ name, description, selectedMembers });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update member department / team tags
// @route   PUT /api/workspaces/members/:id
// @access  Private
exports.updateMemberDepartment = async (req, res) => {
    try {
        const memberId = req.params.id;
        // Accept either a single team string or an array of teams
        const { team, teams } = req.body;
        const newTeams = teams || (team ? [team] : []);

        // Always operate on the workspace the current user OWNS
        let workspace = await Workspace.findOne({ owner: req.user.id });
        if (!workspace) {
            workspace = await Workspace.findOne({ 'members.user': req.user.id });
        }

        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        const memberIndex = workspace.members.findIndex(m => m.user.toString() === memberId);

        if (memberIndex === -1) {
            // Member is not in this workspace yet — add them automatically
            workspace.members.push({
                user: memberId,
                role: 'member',
                teams: newTeams,
                status: 'joined'
            });
            await workspace.save();
            return res.status(200).json(workspace.members[workspace.members.length - 1]);
        }

        workspace.members[memberIndex].teams = newTeams;
        await workspace.save();

        res.status(200).json(workspace.members[memberIndex]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
