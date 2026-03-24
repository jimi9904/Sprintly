const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/statsController');

router.use(protect);

router.get('/dashboard', getDashboardStats);

module.exports = router;
