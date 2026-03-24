const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validations/authValidation');

// Public routes (with rate limiting + validation)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.get('/verify/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

module.exports = router;
