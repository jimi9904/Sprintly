import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socketService';
import {
    setConnected,
    setOnlineUsers,
    addTypingUser,
    removeTypingUser,
} from '../redux/slices/socketSlice';
import { updateTaskLocal, createTaskLocal, deleteTaskLocal } from '../redux/slices/taskSlice';
import { addActivityLocal } from '../redux/slices/activitySlice';
import { addNotification } from '../redux/slices/notificationSlice';

/**
 * useSocket — app-level hook to establish the socket connection and bind
 * all global event listeners. Call once at the top of DashboardLayout.
 * 
 * @param {string|null} token - JWT token from auth state
 */
const useSocket = (token) => {
    const dispatch = useDispatch();
    const isConnected = useSelector(state => state.socket.isConnected);
    const isMounted = useRef(false);

    useEffect(() => {
        if (!token || isMounted.current) return;
        isMounted.current = true;

        // Connect socket
        const socket = socketService.connect(token);

        // ── Connection Status ──────────────────────────────────────────────────
        socket.on('connect', () => dispatch(setConnected(true)));
        socket.on('disconnect', () => dispatch(setConnected(false)));

        // ── Presence ───────────────────────────────────────────────────────────
        socket.on('presence:update', (users) => {
            dispatch(setOnlineUsers(users));
        });

        // ── Live Task Events ───────────────────────────────────────────────────
        socket.on('task:created', (task) => {
            dispatch(createTaskLocal(task));
            dispatch(addActivityLocal({
                user: task.createdByName || 'Someone',
                action: 'created task',
                target: task.title,
            }));
        });

        socket.on('task:updated', (task) => {
            dispatch(updateTaskLocal({ id: task._id, updates: task }));
            dispatch(addActivityLocal({
                user: task.updatedByName || 'Someone',
                action: 'updated task',
                target: task.title,
            }));
        });

        socket.on('task:deleted', ({ taskId, taskTitle }) => {
            dispatch(deleteTaskLocal(taskId));
            dispatch(addActivityLocal({
                user: 'Someone',
                action: 'deleted task',
                target: taskTitle || 'a task',
            }));
        });

        // ── Live Comments ──────────────────────────────────────────────────────
        socket.on('comment:new', ({ taskId, comment, taskTitle }) => {
            // Update the task in local state with the new comment appended
            dispatch(updateTaskLocal({
                id: taskId,
                updates: { _prependComment: comment }
            }));
            dispatch(addActivityLocal({
                user: comment.authorName || 'Someone',
                action: 'commented on',
                target: taskTitle || 'a task',
                detail: comment.text?.substring(0, 80),
            }));
        });

        // ── Typing Indicators ──────────────────────────────────────────────────
        socket.on('typing:start', ({ userId, name, taskId }) => {
            dispatch(addTypingUser({ taskId, userId, name }));
        });

        socket.on('typing:stop', ({ userId, taskId }) => {
            dispatch(removeTypingUser({ taskId, userId }));
        });

        // ── Live Notifications ─────────────────────────────────────────────────
        socket.on('notification:new', (notification) => {
            dispatch(addNotification(notification));
        });

        return () => {
            socketService.disconnect();
            dispatch(setConnected(false));
            isMounted.current = false;
        };
    }, [token]);

    return { isConnected };
};

export default useSocket;
