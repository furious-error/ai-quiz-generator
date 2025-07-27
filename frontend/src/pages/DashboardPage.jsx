// src/pages/DashboardPage.js

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../hooks/useQuiz';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';
import { GENERIC_ERROR_MESSAGE } from '../utils/constants';

function DashboardPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { quizzes, loading: quizLoading, error: quizError, fetchUserQuizzes } = useQuiz();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserQuizzes();
        }
    }, [isAuthenticated, fetchUserQuizzes]);

    if (authLoading || quizLoading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (quizError) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-gray-100 p-4">
                <p className="text-red-600 text-center text-lg bg-white p-6 rounded-lg shadow-md mb-4">
                    Error loading your quizzes: {quizError || GENERIC_ERROR_MESSAGE}
                </p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-10">
                My Quizzes
            </h1>

            {quizzes.length === 0 ? (
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center max-w-lg mx-auto">
                    <p className="text-lg md:text-xl text-gray-600 mb-6">
                        You haven't generated any quizzes yet.
                    </p>
                    <Button onClick={() => navigate('/generate-quiz')} className="py-2 px-6 text-lg">
                        Generate Your First Quiz
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2 truncate">
                                {quiz.topic}
                            </h2>
                            <p className="text-gray-600 text-sm mb-1">
                                <span className="font-medium">Questions:</span> {quiz.num_questions}
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                                <span className="font-medium">Difficulty:</span> {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                            </p>
                            <p className="text-gray-600 text-sm mb-4">
                                <span className="font-medium">Generated:</span> {formatDate(quiz.generated_at)}
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                                <Link to={`/take-quiz/${quiz._id}`} className="w-full">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                                        Take Quiz
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;