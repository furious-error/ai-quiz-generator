// src/api/auth.js

import apiClient from './index'; 

export const registerUser = async (userData) => {
    try {
        // console.log({userData});
        const response = await apiClient.post('/auth/register', userData);
        return response.data; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
};