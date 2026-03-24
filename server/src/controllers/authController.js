const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'secret123';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_456';

// Generate short-lived access token (15 minutes)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Generate long-lived refresh token (7 days)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Helper to set refresh token cookie
const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });

        // Auto-create a default workspace for the new user
        const Workspace = require('../models/Workspace');
        await Workspace.create({
            name: `${user.name}'s Workspace`,
            owner: user._id,
            members: [{ user: user._id, role: 'admin', teams: ['Owner'], status: 'joined' }]
        });

        // Generate email verification token
        const verifyToken = user.getVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Log verification URL (no email service configured)
        const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verifyToken}`;
        console.log(`📧 Email Verification Link for ${email}: ${verifyUrl}`);

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store hashed refresh token in DB
        user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await user.save({ validateBeforeSave: false });

        // Set refresh token in httpOnly cookie
        setRefreshCookie(res, refreshToken);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Store hashed refresh token
            user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
            await user.save({ validateBeforeSave: false });

            setRefreshCookie(res, refreshToken);

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                token: accessToken,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token using httpOnly cookie
// @route   POST /api/auth/refresh-token
// @access  Public (cookie required)
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Find user and check stored hash matches
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== hashedToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Issue new access token
        const newAccessToken = generateAccessToken(user._id);

        res.json({ token: newAccessToken });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user (clear cookie + refresh token)
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = async (req, res, next) => {
    try {
        // Clear refresh token from DB
        if (req.user) {
            await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        }

        // Clear httpOnly cookie
        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password - generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Log reset URL to console (no email service)
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        console.log(`🔑 Password Reset Link for ${email}: ${resetUrl}`);

        res.status(200).json({
            message: 'Password reset link sent (check server console for demo)',
            // In development, include the token for easy testing
            ...(process.env.NODE_ENV !== 'production' && { resetToken })
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        // Hash the token from the URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify email using token
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        const verificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({ verificationToken });

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        next(error);
    }
};
