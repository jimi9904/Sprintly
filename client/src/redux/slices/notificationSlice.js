import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, thunkAPI) => {
    try {
        return await notificationService.getNotifications();
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const acceptInvite = createAsyncThunk('notifications/acceptInvite', async (notificationId, thunkAPI) => {
    try {
        await notificationService.acceptInvite(notificationId);
        return notificationId;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const declineInvite = createAsyncThunk('notifications/declineInvite', async (notificationId, thunkAPI) => {
    try {
        await notificationService.declineInvite(notificationId);
        return notificationId;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                const data = Array.isArray(action.payload) ? action.payload : [];
                state.notifications = data;
                state.unreadCount = data.filter(n => !n.read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(acceptInvite.fulfilled, (state, action) => {
                const id = action.payload;
                state.notifications = state.notifications.filter(n => n._id !== id);
                state.unreadCount = state.notifications.filter(n => !n.read).length;
            })
            .addCase(declineInvite.fulfilled, (state, action) => {
                const id = action.payload;
                state.notifications = state.notifications.filter(n => n._id !== id);
                state.unreadCount = state.notifications.filter(n => !n.read).length;
            });
    }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
