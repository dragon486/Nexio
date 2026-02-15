import api from './api';

export const getAnalytics = async () => {

    // For now, return mock data if API fails or no token, to show UI 
    // (Developer experience: dashboard shouldn't be blank while building)
    try {
        const response = await api.get('/analytics');
        return response.data;
    } catch (error) {
        console.warn("Analytics fetch failed, using mock data:", error);
        return {
            funnel: { new: 15, contacted: 8, qualified: 5, converted: 2, lost: 3 },
            aiPerformance: { avgScore: 72, highPriority: 5, midPriority: 8, lowPriority: 10 },
            conversionRate: 12.5
        };
    }
};
