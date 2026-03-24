/**
 * Generic Zod validation middleware.
 * Accepts a Zod schema and validates req.body against it.
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    // Replace body with parsed/clean data
    req.body = result.data;
    next();
};

module.exports = validate;
