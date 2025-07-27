

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { loginUser, registerUser } from '../api/auth'; 
import { getUserProfile } from '../api/user'; 
import { setToken, getToken, removeToken, isAuthenticated as checkIsAuthenticated } from '../utils/token'; 
import { GENERIC_ERROR_MESSAGE } from '../utils/constants';


const AuthContext = createContext(null);


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    
    const loadUser = useCallback(async () => {
        const token = getToken();
        if (token) {
            try {
                const user = await getUserProfile(); 
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to load user profile:', error);
                removeToken(); 
                setCurrentUser(null);
                setIsAuthenticated(false);
                
                
                
                
            }
        } else {
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);

    
    useEffect(() => {
        loadUser();
    }, [loadUser]); 

    
    const login = async (email, password) => {
        try {
            setLoading(true);
            const data = await loginUser({ email, password });
            setToken(data.access_token);
            await loadUser(); 
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Login failed:', error);
            setCurrentUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            
            throw error;
        }
    };

    
    const register = async (email, password) => {
        try {
            console.log({email, password});
            setLoading(true);
            const data = await registerUser({ email, password });
            
            
            
            console.log('Registration successful:', data);
            setLoading(false);
            return data; 
        } catch (error) {
            console.error('Registration failed:', error);
            setLoading(false);
            throw error;
        }
    };

    
    const logout = () => {
        removeToken();
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/login'); 
    };

    
    const authContextValue = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};