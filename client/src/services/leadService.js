import api from './api';

export const getLeads = async () => {
    try {
        const response = await api.get('/leads');
        return response.data;
    } catch (error) {
        console.warn("Leads fetch failed, returning empty array:", error);
        return [];
    }
};

export const getLead = async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await api.patch(`/leads/${id}/read`);
    return response.data;
};
export const markAllAsRead = async () => {
    const response = await api.patch('/leads/all/read');
    return response.data;
};export const updateLead = async (id, data) => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data;
};
