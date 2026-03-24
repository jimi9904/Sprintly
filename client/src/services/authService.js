import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const login = async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (err) {
        // Even if logout endpoint fails, clear local storage
        console.error('Logout API error:', err);
    }
    localStorage.removeItem('token');
};

const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

const resetPassword = async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
};

export default authService;
