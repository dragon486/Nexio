import api from './api';

export const getAnalytics = async (timeRange = '7d') => {

    // For now, return mock data if API fails or no token, to show UI 
    // (Developer experience: dashboard shouldn't be blank while building)
    try {
        const response = await api.get('/analytics', { params: { timeRange } });
        return response.data;
    } catch (error) {
        console.warn("Analytics fetch failed:", error);
        // Return null or empty structure so UI handles "No Data" gracefully
        return null;
    }
};
