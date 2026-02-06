import api from './api';

export const updateProfile = async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
};
