import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
};

// Async Thunks
export const getProjects = createAsyncThunk('projects/getAll', async (_, thunkAPI) => {
    try {
        return await projectService.getProjects();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getProject = createAsyncThunk('projects/getOne', async (id, thunkAPI) => {
    try {
        return await projectService.getProject(id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, thunkAPI) => {
    try {
        return await projectService.createProject(projectData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, thunkAPI) => {
    try {
        await projectService.deleteProject(id);
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.currentProject = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.loading = false;
                // If it's a paginated wrapper, unpack it. If it's a direct array, use it directly.
                state.projects = action.payload?.data ? action.payload.data : (Array.isArray(action.payload) ? action.payload : []);
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProject.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(getProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                // Ensure the appended project has a status so the dashboard metrics count it
                const newProject = { status: 'active', ...action.payload };
                state.projects.unshift(newProject);
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(project => project._id !== action.payload);
            });
    },
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;
