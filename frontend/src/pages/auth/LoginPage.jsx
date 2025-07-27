// src/pages/auth/LoginPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../../components/common/InputField';
import AuthForm from '../../components/auth/AuthForm';
import { GENERIC_ERROR_MESSAGE } from '../../utils/constants';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, loading, isAuthenticated } = useAuth(); 

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard'); 
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        try {
            await login(email, password);
        } catch (err) {
            const errorMessage = err.detail || GENERIC_ERROR_MESSAGE;
            setError(errorMessage);
            console.error('Login failed:', err);
        }
    };

    if (isAuthenticated) {
        return null; 
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <AuthForm
                title="Login"
                submitButtonText="Login"
                onSubmit={handleSubmit}
                error={error}
                loading={loading}
                footerContent={
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                }
            >
                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="text-base" 
                />
                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                    className="text-base" 
                />
            </AuthForm>
        </div>
    );
}

export default LoginPage;