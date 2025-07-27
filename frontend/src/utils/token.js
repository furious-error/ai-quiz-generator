// src/utils/token.js

import { TOKEN_STORAGE_KEY } from './constants';

/**
 * Stores the JWT token in localStorage.
 * @param {string} token - The JWT token received from the backend.
 */
export const setToken = (token) => {
    try {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
        console.error("Error setting token in localStorage:", error);
        // Handle cases where localStorage might not be available or full
    }
};

/**
 * Retrieves the JWT token from localStorage.
 * @returns {string | null} The JWT token if found, otherwise null.
 */
export const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
        console.error("Error getting token from localStorage:", error);
        return null;
    }
};

/**
 * Removes the JWT token from localStorage.
 */
export const removeToken = () => {
    try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
        console.error("Error removing token from localStorage:", error);
    }
};

/**
 * Checks if a token exists and is not expired (basic check based on existence).
 * For full expiration check, you'd need to decode the JWT on the client side,
 * but that's often handled by the backend rejecting expired tokens.
 * @returns {boolean} True if a token exists, false otherwise.
 */
export const isAuthenticated = () => {
    return !!getToken();
};