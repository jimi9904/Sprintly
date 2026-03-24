const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Security: sanitize user input against NoSQL injection
app.use(mongoSanitize());

// Security: global rate limiter
app.use(globalLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/search', require('./routes/search'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Sprintly API' });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
