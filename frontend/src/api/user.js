// src/api/user.js

import apiClient from './index'; 

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
};