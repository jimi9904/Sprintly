import api from './api';

const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

const getTasks = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data; // Returns { data: [...], pagination: {...} }
};

const getAllUserTasks = async () => {
    const response = await api.get('/tasks');
    return response.data; // Returns { data: [...], pagination: {...} }
};

const createTask = async (projectId, taskData) => {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
};

const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
};

const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

const taskService = {
    getTaskById,
    getTasks,
    getAllUserTasks,
    createTask,
    updateTask,
    deleteTask,
};

export default taskService;
