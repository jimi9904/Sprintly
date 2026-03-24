const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/activity
router.get('/', protect, activityController.getRecentActivity);

// POST /api/activity — persist a new activity log from the frontend
router.post('/', protect, activityController.createActivity);

module.exports = router;
