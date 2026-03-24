const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters').trim(),
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'admin']).optional()
});

const loginSchema = z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(1, 'Password is required')
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Please provide a valid email')
});

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters')
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};
