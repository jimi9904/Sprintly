const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Tracks online users: { userId -> { socketId, name, avatar } }
const onlineUsers = new Map();

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
    });

    // ── Auth Middleware ─────────────────────────────────────────────────────────
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication error: no token'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sprintly_secret');
            socket.user = decoded; // attach user payload to socket
            next();
        } catch (err) {
            next(new Error('Authentication error: invalid token'));
        }
    });

    // ── Connection Handler ──────────────────────────────────────────────────────
    io.on('connection', (socket) => {
        const { id: userId, name, avatar } = socket.user;
        console.log(`🔌 Socket connected: ${name} (${socket.id})`);

        // Register presence
        onlineUsers.set(userId, { socketId: socket.id, name, avatar, userId });

        // Join a personal room keyed by userId, so the server can target
        // individual users with io.to(userId).emit(...)
        socket.join(userId);

        // Broadcast updated presence list to everyone
        io.emit('presence:update', Array.from(onlineUsers.values()));

        // ── Room Events ───────────────────────────────────────────────────────
        socket.on('join-project', (projectId) => {
            socket.join(`project:${projectId}`);
            console.log(`👤 ${name} joined room project:${projectId}`);
            // Notify others in the room
            socket.to(`project:${projectId}`).emit('presence:joined-project', {
                userId, name, avatar, projectId
            });
        });

        socket.on('leave-project', (projectId) => {
            socket.leave(`project:${projectId}`);
            socket.to(`project:${projectId}`).emit('presence:left-project', {
                userId, projectId
            });
        });

        // ── Typing Indicators ─────────────────────────────────────────────────
        socket.on('typing:start', ({ projectId, taskId }) => {
            socket.to(`project:${projectId}`).emit('typing:start', {
                userId, name, taskId
            });
        });

        socket.on('typing:stop', ({ projectId, taskId }) => {
            socket.to(`project:${projectId}`).emit('typing:stop', {
                userId, taskId
            });
        });

        // ── Disconnect ────────────────────────────────────────────────────────
        socket.on('disconnect', (reason) => {
            console.log(`🔌 Socket disconnected: ${name} — ${reason}`);
            onlineUsers.delete(userId);
            io.emit('presence:update', Array.from(onlineUsers.values()));
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
