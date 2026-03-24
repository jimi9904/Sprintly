import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import activityService from '../../services/activityService';

const MAX_LOCAL = 20;

const initialState = {
    activities: [],
    loading: false,
    error: null
};

// Map a raw DB activity document → frontend shape
const mapActivity = (act) => ({
    id: act._id,
    user: act.user?.name || 'System',
    action: act.action,
    target: act.entity,
    detail: act.details,
    time: act.timestamp
});

// Fetch up to 20 persisted activities from DB
export const fetchActivities = createAsyncThunk('activity/getAll', async (_, thunkAPI) => {
    try {
        return await activityService.getActivities();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Persist a new activity to the DB and add it to local state
export const addActivity = createAsyncThunk('activity/add', async (activityData, thunkAPI) => {
    try {
        const saved = await activityService.postActivity({
            action: activityData.action || '',
            entity: activityData.target || '',
            details: activityData.detail || ''
        });
        return saved;
    } catch (error) {
        // If backend call fails, still return a local-only version so the UI isn't broken
        return { _id: `local-${Date.now()}`, user: { name: activityData.user || 'You' }, action: activityData.action, entity: activityData.target, details: activityData.detail, timestamp: new Date().toISOString() };
    }
});

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        // For socket-received events from OTHER users — local state only, no DB write
        addActivityLocal: (state, action) => {
            const mapped = {
                id: `local-${Date.now()}-${Math.random()}`,
                user: action.payload.user || 'System',
                action: action.payload.action || '',
                target: action.payload.target || '',
                detail: action.payload.detail || '',
                time: new Date().toISOString()
            };
            state.activities = [mapped, ...state.activities].slice(0, MAX_LOCAL);
        },
        clearActivities: (state) => {
            state.activities = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // ── fetchActivities ──────────────────────────────────────────────
            .addCase(fetchActivities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.activities = (action.payload || []).slice(0, MAX_LOCAL).map(mapActivity);
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ── addActivity ──────────────────────────────────────────────────
            .addCase(addActivity.fulfilled, (state, action) => {
                const mapped = mapActivity(action.payload);
                // Prepend and keep max 20
                state.activities = [mapped, ...state.activities].slice(0, MAX_LOCAL);
            });
    }
});

export const { addActivityLocal, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
