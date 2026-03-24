import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    // ── Lifecycle ───────────────────────────────────────────────────────────────
    connect(token) {
        if (this.socket?.connected) return this.socket;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('🔌 Socket connected:', this.socket.id);
        });

        this.socket.on('connect_error', (err) => {
            console.warn('Socket connection error:', err.message);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    // ── Room Management ─────────────────────────────────────────────────────────
    joinProject(projectId) {
        this.socket?.emit('join-project', projectId);
    }

    leaveProject(projectId) {
        this.socket?.emit('leave-project', projectId);
    }

    // ── Typing Indicators ───────────────────────────────────────────────────────
    startTyping(projectId, taskId) {
        this.socket?.emit('typing:start', { projectId, taskId });
    }

    stopTyping(projectId, taskId) {
        this.socket?.emit('typing:stop', { projectId, taskId });
    }

    // ── Generic Event Helpers ───────────────────────────────────────────────────
    on(event, callback) {
        this.socket?.on(event, callback);
    }

    off(event, callback) {
        this.socket?.off(event, callback);
    }

    emit(event, data) {
        this.socket?.emit(event, data);
    }
}

// Singleton export
const socketService = new SocketService();
export default socketService;
