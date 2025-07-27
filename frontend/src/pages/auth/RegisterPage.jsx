// src/pages/auth/RegisterPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../../components/common/InputField';
import AuthForm from '../../components/auth/AuthForm';
import { GENERIC_ERROR_MESSAGE } from '../../utils/constants';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { register, loading, isAuthenticated } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setSuccessMessage(null); 

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await register(email, password); 
            setSuccessMessage('Registration successful! Please log in.');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errorMessage = err.detail || GENERIC_ERROR_MESSAGE;
            setError(errorMessage);
            console.error('Registration failed:', err);
        }
    };

    if (isAuthenticated) {
        return null; 
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <AuthForm
                title="Register"
                submitButtonText="Register"
                onSubmit={handleSubmit}
                error={error}
                loading={loading}
                footerContent={
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                }
            >
                {successMessage && (
                    <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm">
                        {successMessage}
                    </p>
                )}
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
                <InputField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="********"
                    className="text-base"
                    error={error && error.includes('match') ? error : null} 
                />
            </AuthForm>
        </div>
    );
}

export default RegisterPage;