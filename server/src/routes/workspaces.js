const express = require('express');
const router = express.Router();
const {
    inviteMember,
    createDepartment,
    getMembers,
    updateMemberDepartment,
    getWorkspaces
} = require('../controllers/workspaceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getWorkspaces);

router.route('/members')
    .get(getMembers);

router.route('/invite')
    .post(inviteMember);

router.route('/departments')
    .post(createDepartment);

router.route('/members/:id')
    .put(updateMemberDepartment);

module.exports = router;
