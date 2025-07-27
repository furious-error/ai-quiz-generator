// src/hooks/useLocalStorage.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to store and retrieve a value in localStorage.
 *
 * @param {string} key - The key under which the value will be stored in localStorage.
 * @param {any} initialValue - The initial value if nothing is found in localStorage.
 * @returns {[any, Function]} A stateful value and a function to update it.
 */
export const useLocalStorage = (key, initialValue) => {
    
    
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, storedValue]); 

    return [storedValue, setStoredValue];
};