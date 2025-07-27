// src/pages/quizzes/QuizResultPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../hooks/useQuiz';
import QuizSummary from '../../components/quiz/QuizSummary';
import ExplanationCard from '../../components/quiz/ExplanationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { GENERIC_ERROR_MESSAGE } from '../../utils/constants';

function QuizResultPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const {
        quizResult,
        loading: quizLoading,
        error: quizError,
        submitQuizAnswers, 
    } = useQuiz();

    const [localQuizResult, setLocalQuizResult] = useState(null);
    const [resultLoading, setResultLoading] = useState(true);
    const [resultError, setResultError] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (location.state && location.state.quizResult) {
            setLocalQuizResult(location.state.quizResult);
            setResultLoading(false);
        } else if (quizId && isAuthenticated) {
            // console.warn("Quiz results not found in navigation state. Redirecting to dashboard.");
            setResultError("Quiz results not directly accessible. Please submit a quiz first.");
            setResultLoading(false);
        } else {
            setResultLoading(false);
            setResultError(GENERIC_ERROR_MESSAGE);
        }
    }, [quizId, isAuthenticated, location.state, navigate, submitQuizAnswers]);

    const displayedQuizResult = localQuizResult || quizResult;

    if (authLoading || !isAuthenticated || resultLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (resultError || !displayedQuizResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <p className="text-red-600 text-center text-lg bg-white p-6 rounded-lg shadow-md mb-4">
                    {resultError || "Could not load quiz results."}
                </p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Go to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                Quiz Completed!
            </h1>

            <QuizSummary
                totalQuestions={displayedQuizResult.total_questions}
                correctCount={displayedQuizResult.correct_count}
                score={displayedQuizResult.score}
            />

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">
                Detailed Explanations
            </h2>

            <div className="space-y-6">
                {displayedQuizResult.results.map((result, index) => (
                    <ExplanationCard key={result.question_id} questionResult={result} />
                ))}
            </div>

            <div className="text-center mt-8">
                <Button onClick={() => navigate('/dashboard')} className="py-3 px-8 text-lg">
                    Back to My Quizzes
                </Button>
            </div>
        </div>
    );
}

export default QuizResultPage;