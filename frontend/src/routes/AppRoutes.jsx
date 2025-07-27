// src/routes/AppRoutes.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import GenerateQuizPage from '../pages/quizzes/GenerateQuizPage';
import TakeQuizPage from '../pages/quizzes/TakeQuizPage';
import QuizResultPage from '../pages/quizzes/QuizResultPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import LandingPage from '../pages/LandingPage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/ai-quiz-generator" replace />;
    }

    return children;
};

const AppRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ai-quiz-generator" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/generate-quiz"
                element={
                    <ProtectedRoute>
                        <GenerateQuizPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/take-quiz/:quizId"
                element={
                    <ProtectedRoute>
                        <TakeQuizPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quiz-result/:quizId"
                element={
                    <ProtectedRoute>
                        <QuizResultPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
export default AppRoutes;