import api from './api';

const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

const acceptInvite = async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/accept`);
    return response.data;
};

const declineInvite = async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/decline`);
    return response.data;
};

const notificationService = {
    getNotifications,
    acceptInvite,
    declineInvite,
};

export default notificationService;
