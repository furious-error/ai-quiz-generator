// src/api/index.js

import axios from 'axios';
import { getToken, removeToken } from '../utils/token'; 


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("VITE_API_BASE_URL is not defined in your .env file.");
}


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});



apiClient.interceptors.request.use(
    async (config) => { 
        const token = getToken(); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    async (error) => { 
        throw error; 
    }
);



apiClient.interceptors.response.use(
    async (response) => { 
        return response; 
    },
    async (error) => { 
        if (error.response) {
            const { status, config } = error.response;
            if ((status === 401 || status === 403) &&
                !config.url.includes('/auth/login') &&
                !config.url.includes('/auth/register')) {
                console.error('Authentication error (401/403). Invalid or expired token.');
                removeToken(); 
                window.location.href = '/login'; 
            }
        }
        throw error; 
    }
);

export default apiClient;