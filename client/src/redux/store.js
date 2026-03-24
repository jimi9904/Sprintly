import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import activityReducer from './slices/activitySlice';
import chatReducer from './slices/chatSlice';
import socketReducer from './slices/socketSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        projects: projectReducer,
        tasks: taskReducer,
        activity: activityReducer,
        chat: chatReducer,
        socket: socketReducer,
        notifications: notificationReducer,
    },
});
