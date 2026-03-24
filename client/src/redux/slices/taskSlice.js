import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

const initialState = {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
};

// Async Thunks
export const getTaskById = createAsyncThunk('tasks/getOne', async (id, thunkAPI) => {
    try {
        return await taskService.getTaskById(id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTasks = createAsyncThunk('tasks/getAll', async (projectId, thunkAPI) => {
    try {
        return await taskService.getTasks(projectId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getAllUserTasks = createAsyncThunk('tasks/getAllUser', async (_, thunkAPI) => {
    try {
        return await taskService.getAllUserTasks();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createTask = createAsyncThunk('tasks/create', async ({ projectId, taskData }, thunkAPI) => {
    try {
        return await taskService.createTask(projectId, taskData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, taskData }, thunkAPI) => {
    try {
        return await taskService.updateTask(id, taskData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
    try {
        const response = await taskService.deleteTask(id);
        return response.task; // Return the updated task from the backend instead of just the id
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.tasks = [];
        },
        createTaskLocal: (state, action) => {
            state.tasks.push(action.payload);
        },
        updateTaskLocal: (state, action) => {
            const index = state.tasks.findIndex(t => t._id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...action.payload.updates };
            }
        },
        deleteTaskLocal: (state, action) => {
            state.tasks = state.tasks.filter(t => t._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTaskById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTask = action.payload; // Not paginated
            })
            .addCase(getTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload?.data ? action.payload.data : Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllUserTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUserTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload?.data ? action.payload.data : Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllUserTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    // Preserve populated project if server response stripped it back to ID
                    const existingProject = state.tasks[index].project;
                    const incomingProject = action.payload.project;
                    const project = (incomingProject && typeof incomingProject === 'object' && incomingProject.name)
                        ? incomingProject
                        : existingProject;
                    state.tasks[index] = { ...action.payload, project };
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                if (action.payload && action.payload._id) {
                    if (action.payload.deleted) {
                        state.tasks = state.tasks.filter(task => task._id !== action.payload._id);
                    } else {
                        const index = state.tasks.findIndex(task => task._id === action.payload._id);
                        if (index !== -1) {
                            state.tasks[index] = action.payload;
                        }
                    }
                }
            });
    },
});

export const { reset, createTaskLocal, updateTaskLocal, deleteTaskLocal } = taskSlice.actions;
export default taskSlice.reducer;
