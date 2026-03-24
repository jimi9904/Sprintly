import api from './api';

const fetchWorkspaceMembers = async () => {
    const response = await api.get('/workspaces/members');
    return response.data;
};

const inviteMember = async (inviteData) => {
    const response = await api.post('/workspaces/invite', inviteData);
    return response.data;
};

const createDepartment = async (departmentData) => {
    const response = await api.post('/workspaces/departments', departmentData);
    return response.data;
};

const updateMemberDepartment = async (memberId, teamData) => {
    const response = await api.put(`/workspaces/members/${memberId}`, teamData);
    return response.data;
};

const workspaceService = {
    fetchWorkspaceMembers,
    inviteMember,
    createDepartment,
    updateMemberDepartment,
};

export default workspaceService;
