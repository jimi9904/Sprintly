import api from './api';

const getActivities = async () => {
    const response = await api.get('/activity');
    return response.data;
};

const postActivity = async (activityData) => {
    const response = await api.post('/activity', activityData);
    return response.data;
};

const activityService = {
    getActivities,
    postActivity
};

export default activityService;
