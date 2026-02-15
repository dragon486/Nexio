import api from './api';

export const getLeads = async () => {
    try {
        const response = await api.get('/leads');
        return response.data;
    } catch (error) {
        console.warn("Leads fetch failed, using mock data:", error);
        return [
            { _id: '1', name: 'John Doe', email: 'john@example.com', status: 'new', aiScore: 45, aiPriority: 'medium', createdAt: new Date().toISOString() },
            { _id: '2', name: 'Jane Smith', email: 'jane@enterprise.com', status: 'qualified', aiScore: 92, aiPriority: 'high', createdAt: new Date().toISOString() },
            { _id: '3', name: 'Spam Bot', email: 'bot@spam.com', status: 'lost', aiScore: 10, aiPriority: 'low', createdAt: new Date().toISOString() },
        ];
    }
};
