// src/pages/ProfilePage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';

function ProfilePage() {
    const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 p-4">
                <p className="text-red-600 text-center text-lg bg-white p-6 rounded-lg shadow-md">
                    Failed to load user profile. Please try logging in again.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                    User Profile
                </h1>

                <div className="space-y-4 text-base md:text-lg text-gray-700">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="font-semibold">Email:</span>
                        <span>{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="font-semibold">Member Since:</span>
                        <span>{formatDate(currentUser.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="font-semibold">Daily AI Requests Used:</span>
                        <span>{currentUser.daily_ai_requests_count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Last Request Date:</span>
                        <span>{currentUser.last_request_date}</span>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Button onClick={() => navigate('/dashboard')} className="py-2 px-6 text-lg">
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;