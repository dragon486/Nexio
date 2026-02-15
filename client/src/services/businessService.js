import api from './api';

export const createBusiness = async (data) => {
    const response = await api.post('/business', data);
    return response.data;
};

export const getMyBusiness = async () => {
    const response = await api.get('/business/my'); // Matches router.get('/my')
    return response.data;
};

export const updateBusiness = async (id, data) => {
    const response = await api.put(`/business/${id}`, data);
    return response.data;
};
