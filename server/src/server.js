require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { initSocket } = require('./socket/socketManager');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sprintly';

// Wrap Express in an HTTP server so Socket.io can share the same port
const httpServer = http.createServer(app);

// Boot Socket.io — returns the `io` instance for use in controllers
const io = initSocket(httpServer);

// Make `io` accessible app-wide via app.locals
app.locals.io = io;

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🔌 Socket.io listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

