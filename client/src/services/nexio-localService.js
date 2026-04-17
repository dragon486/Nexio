import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
    const token = localStorage.getItem('nexio_token') || localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

const api = axios.create({ baseURL: `${API_URL}/api/hyperlocal` });
api.interceptors.request.use(cfg => {
    cfg.headers = { ...cfg.headers, ...getAuthHeaders() };
    return cfg;
});

export const nexioLocalService = {
    // Business
    register: (data) => api.post('/register', data).then(r => r.data),
    getMyBusiness: () => api.get('/my').then(r => r.data),
    updateConfig: (id, data) => api.put(`/${id}/config`, data).then(r => r.data),

    // Conversations
    getConversations: (id, params = {}) =>
        api.get(`/${id}/conversations`, { params }).then(r => r.data),

    // Customers
    getCustomers: (id, params = {}) =>
        api.get(`/${id}/customers`, { params }).then(r => r.data),

    // Broadcasts
    getBroadcasts: (id) => api.get(`/${id}/broadcasts`).then(r => r.data),
    sendBroadcast: (id, data) => api.post(`/${id}/broadcast`, data).then(r => r.data),

    // Analytics
    getAnalytics: (id) => api.get(`/${id}/analytics`).then(r => r.data),
};

export default nexioLocalService;
