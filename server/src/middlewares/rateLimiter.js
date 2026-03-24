const rateLimit = require('express-rate-limit');

// Rate limits removed for development
const globalLimiter = (req, res, next) => next();

// Rate limits removed for development
const authLimiter = (req, res, next) => next();

module.exports = { globalLimiter, authLimiter };
