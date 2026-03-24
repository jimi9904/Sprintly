const express = require('express');
const router = express.Router();
const {
    getNotifications,
    acceptInvite,
    declineInvite,
    markAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getNotifications);

router.route('/:id/accept')
    .post(acceptInvite);

router.route('/:id/decline')
    .post(declineInvite);

router.route('/:id/read')
    .put(markAsRead);

module.exports = router;
