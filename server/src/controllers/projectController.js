const Project = require('../models/Project');
const paginate = require('../utils/paginate');
const { invalidateCache } = require('./statsController');
const { logActivity } = require('./activityController');
const Workspace = require('../models/Workspace');

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await paginate(Project, { owner: req.user.id }, page, limit);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    try {
        const workspace = await Workspace.findOne({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        });

        if (!workspace) {
            workspace = await Workspace.create({
                name: `${req.user.name}'s Workspace`,
                owner: req.user.id,
                members: [{ user: req.user.id, role: 'admin', team: 'Owner', status: 'joined' }]
            });
        }

        const project = await Project.create({
            ...req.body,
            owner: req.user.id,
            workspaceId: workspace._id
        });

        await logActivity(
            req.user.id,
            'created project',
            'Project',
            project._id,
            `created Project ${project.name}`
        );

        invalidateCache(project.workspaceId);

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        invalidateCache(project.workspaceId);

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await project.deleteOne();

        invalidateCache(project.workspaceId);

        res.status(200).json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
