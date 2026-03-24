const express = require('express');
// mergeParams: true allows access to params from parent router (projects)
const router = express.Router({ mergeParams: true });
const {
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getAllUserTasks
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Routes for /api/projects/:projectId/tasks
// Routes for /api/tasks and /api/projects/:projectId/tasks (mounted twice)

// Routes for /api/tasks
// Since this router is mounted at /api/tasks in app.js
// AND at /api/projects/:projectId/tasks in projects.js
// We need to distinguish.
// Express handles this by checking if params match.
// But safely, we can check if baseUrl includes 'projects'.
// Or better, define the global list route separate from project-nested routes.
// However, here we are reusing the file.

// If mounted at /api/tasks (no :projectId), then specific handlers apply
// We can use a trick: verify if req.params.projectId exists in the controller.
// But routes are defined here.

// Let's add specific route for GET / (which matches /api/tasks/)
// But wait, getTasks expects projectId.

// Better approach:
// Splitting routes is cleaner, but to save time, I will add a check.
// Actually, `mergeParams: true` means `req.params` has parent params.
// If I add `router.get('/', ...)` it will conflict if I don't distinct.

// Let's modify app.js to mount a DIFFERENT router for /api/tasks if needed,
// OR just add a specific route like `/all` or verify params.

// Simplest: Add `getAllUserTasks` to this router, but handle the case.
// If /api/tasks is called, it hits `/`.
// If /api/projects/:id/tasks is called, it hits `/`.

// I will create a new route handler in this file that helps dispatch.
const handleGetTasks = (req, res, next) => {
    if (req.params.projectId) {
        return getTasks(req, res, next);
    } else {
        return getAllUserTasks(req, res, next);
    }
};

router.route('/')
    .get(handleGetTasks)
    .post(createTask); // Create task likely needs projectId, so POST /api/tasks might fail or need body projectId.

// Routes for /api/tasks/:id
// Note: These need to be mounted at /api/tasks in app.js
// But the controller methods for tasks/:id are updateTask and deleteTask
// We can handle both here if we separate them effectively or use different files.

// Actually, typical REST design:
// GET /projects/:projectId/tasks -> list
// POST /projects/:projectId/tasks -> create
// PUT /tasks/:taskId -> update
// DELETE /tasks/:taskId -> delete

// So we might need two route files or one cleverly checking params.
// Let's assume this file handles BOTH but requires correct mounting.
// Wait, if I mount this at /api/projects/:projectId/tasks, then '/' works.
// For /api/tasks/:id, I need another mount or route.

// Let's modify this file to export a router that handles /:id updates if mounted at /api/tasks
// AND handles / if mounted at /api/projects/:projectId/tasks.

// To avoid confusion, let's keep it simple:
// app.use('/api/projects', projectRouter);
// projectRouter.use('/:projectId/tasks', taskRouter);
// AND app.use('/api/tasks', taskRouter);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
