// src/pages/quizzes/TakeQuizPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../hooks/useQuiz';
import QuizQuestionCard from '../../components/quiz/QuizQuestionCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { GENERIC_ERROR_MESSAGE } from '../../utils/constants';

function TakeQuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const {
        currentQuiz,
        loading: quizLoading,
        error: quizError,
        fetchQuizById,
        submitQuizAnswers,
    } = useQuiz();

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submissionError, setSubmissionError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            // console.log("TakeQuizPage: Not authenticated, redirecting to login.");
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (quizId && isAuthenticated) {
            // console.log(`TakeQuizPage: Attempting to fetch quiz with ID: ${quizId}`);
            fetchQuizById(quizId)
                .then(quiz => {
                    // console.log("TakeQuizPage: Successfully fetched quiz:", quiz);
                })
                .catch((err) => {
                    // console.error("TakeQuizPage: Error fetching quiz:", err); // Log the actual error
                    navigate('/dashboard', { replace: true, state: { error: "Failed to load quiz." } }); 
                });
        } else if (!quizId && !quizLoading && isAuthenticated) {
            // console.error("TakeQuizPage: No quizId provided in URL. Redirecting to dashboard.");
            navigate('/dashboard', { replace: true, state: { error: "No quiz selected to take." } });
        }
    }, [quizId, isAuthenticated, fetchQuizById, navigate]);


    const handleOptionChange = (questionId, selectedOption) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleSubmitQuiz = async () => {
        setSubmissionError(null);
        setIsSubmitting(true);

        const answersToSubmit = currentQuiz.questions.map(q => ({
            question_id: q.id,
            selected_option: selectedAnswers[q.id] || "None"
        }));

        try {
            const result = await submitQuizAnswers(quizId, answersToSubmit);
            if (result) {
                navigate(`/quiz-result/${quizId}`, { state: { quizResult: result } });
            }
        } catch (err) {
            const errorMessage = err.detail || GENERIC_ERROR_MESSAGE;
            setSubmissionError(errorMessage);
            // console.error('Quiz submission failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !isAuthenticated || quizLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (quizError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <p className="text-red-600 text-center text-lg bg-white p-6 rounded-lg shadow-md">
                    Error loading quiz: {quizError}
                    <br />
                    <Button onClick={() => navigate('/dashboard')} className="mt-4">
                        Go to Dashboard
                    </Button>
                </p>
            </div>
        );
    }

    if (!currentQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <p className="text-gray-600 text-center text-lg bg-white p-6 rounded-lg shadow-md">
                    Quiz not found or not loaded.
                    <br />
                    <Button onClick={() => navigate('/dashboard')} className="mt-4">
                        Go to Dashboard
                    </Button>
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                Quiz on: "{currentQuiz.topic}"
            </h1>
            <p className="text-center text-gray-600 mb-8 text-lg">Difficulty: {currentQuiz.difficulty.toUpperCase()}</p>

            <div className="space-y-6">
                {currentQuiz.questions.map((question, index) => (
                    <QuizQuestionCard
                        key={question.id}
                        questionNumber={index + 1}
                        question={question}
                        selectedOption={selectedAnswers[question.id]}
                        onOptionChange={(option) => handleOptionChange(question.id, option)}
                        isReviewMode={false}
                    />
                ))}
            </div>

            {submissionError && (
                <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6 text-center text-sm">
                    {submissionError}
                </p>
            )}

            <div className="text-center mt-8">
                <Button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="py-3 px-8 text-lg bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <LoadingSpinner size="sm" className="mr-2" /> Submitting...
                        </div>
                    ) : (
                        'Submit Quiz'
                    )}
                </Button>
            </div>
        </div>
    );
}

export default TakeQuizPage;