import api from './api';

const getDashboardStats = async () => {
    const response = await api.get('/stats/dashboard');
    return response;
};

const dashboardService = {
    getDashboardStats,
};

export default dashboardService;
