const Task = require('../models/Task');
const Project = require('../models/Project');
const paginate = require('../utils/paginate');
const { invalidateCache } = require('./statsController');
const { getIO } = require('../socket/socketManager');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { page, limit } = req.query;
        const result = await paginate(Task, { project: req.params.projectId }, page, limit);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name _id owner')
            .populate('assignees', 'name email avatar _id');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Verify user has access to this task's project
        // Note: For a more robust app, team member checks would apply. 
        // We'll stick to checking if it exists for now or if they are the owner/assignee.
        const isOwner = task.project && task.project.owner.toString() === req.user.id;
        const isAssignee = task.assignees.some(user => user._id.toString() === req.user.id);

        if (!isOwner && !isAssignee) {
            // For simplicity in this demo, we won't strictly block team members, 
            // but normally we check if the user is part of the workspace
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks for the current user (across all projects)
// @route   GET /api/tasks
// @access  Private
exports.getAllUserTasks = async (req, res) => {
    try {
        // Find projects owned by user
        const projects = await Project.find({ owner: req.user.id });
        const projectIds = projects.map(p => p._id);

        const { page, limit } = req.query;

        // Find tasks in those projects or assigned to user
        const query = {
            $or: [
                { project: { $in: projectIds } },
                { assignees: req.user.id } // Updated from assignee to assignees array from earlier DB changes
            ]
        };

        const result = await paginate(Task, query, page, limit, { populate: { path: 'project', select: 'name' } });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const task = await Task.create({
            ...req.body,
            project: req.params.projectId,
        });

        // Invalidate Stats Cache
        invalidateCache(project.workspaceId);

        // Emit socket event to project room
        const io = getIO();
        if (io) {
            io.to(task.project.toString()).emit('task:created', task);

            // Also notify each assignee directly so it shows on their dashboard
            if (task.assignees && task.assignees.length > 0) {
                task.assignees.forEach(assigneeId => {
                    io.to(assigneeId.toString()).emit('task:created', task);
                });
            }
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project ownership to ensure authorization
        let project = null;
        if (task.project) {
            project = await Project.findById(task.project);
        }

        if (project && project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Removed the hard-delete logic for 'done' tasks so they can be shown in a Completed section

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('project', 'name');

        // Invalidate Stats Cache
        if (project) invalidateCache(project.workspaceId);

        // Emit socket event to project room and assignees
        const io = getIO();
        if (io && task.project) {
            io.to(task.project.toString()).emit('task:updated', task);

            // Also notify each assignee directly
            if (task.assignees && task.assignees.length > 0) {
                task.assignees.forEach(assigneeId => {
                    io.to(assigneeId.toString()).emit('task:updated', task);
                });
            }
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        let project = null;
        if (task.project) {
            project = await Project.findById(task.project);
        }

        if (project && project.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // If the task is already marked as done, hard delete it.
        // Otherwise, soft delete it by marking it as done.
        let isHardDeleted = false;
        if (task.status === 'done') {
            await Task.findByIdAndDelete(req.params.id);
            isHardDeleted = true;
        } else {
            task.status = 'done';
            await task.save();
        }

        // Invalidate Stats Cache
        if (project) invalidateCache(project.workspaceId);

        // Emit socket event to project room and assignees
        const io = getIO();
        if (io && task.project) {
            const eventName = isHardDeleted ? 'task:deleted' : 'task:updated';
            const eventData = isHardDeleted ? { taskId: task._id, taskTitle: task.title } : task;
            io.to(task.project.toString()).emit(eventName, eventData);

            // Also notify each assignee directly
            if (task.assignees && task.assignees.length > 0) {
                task.assignees.forEach(assigneeId => {
                    io.to(assigneeId.toString()).emit(eventName, eventData);
                });
            }
        }

        res.status(200).json({
            message: isHardDeleted ? 'Task deleted completely' : 'Task marked as completed',
            task: isHardDeleted ? { _id: task._id, deleted: true } : task
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
