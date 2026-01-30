import api from './api';

export const updateProfile = async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
};
