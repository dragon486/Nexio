import api from './api';

export const getAnalytics = async (timeRange = '7D') => {
    try {
        const response = await api.get('/analytics', { params: { timeRange } });
        return response.data;
    } catch (error) {
        console.warn("Analytics fetch failed:", error);
        return null;
    }
};
