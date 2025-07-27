

import { useCallback, useState } from 'react';

import { generateQuiz, generateQuizFromFile, getQuizById, getUserQuizzes, submitQuiz } from '../api/quizzes';
import { GENERIC_ERROR_MESSAGE } from '../utils/constants';

/**
 * Custom hook for managing quiz-related operations (generate from topic/file, submit, fetch).
 */
export const useQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizResult, setQuizResult] = useState(null);


    const clearQuizState = useCallback(() => {
        setCurrentQuiz(null);
        setQuizResult(null);
        setError(null);
    }, []);


    const generateNewQuiz = useCallback(async (topic, numQuestions, difficulty) => {
        setLoading(true);
        setError(null);
        clearQuizState();
        try {
            const quizData = await generateQuiz({ topic, num_questions: numQuestions, difficulty });


            setCurrentQuiz(quizData);
            return quizData;
        } catch (err) {
            const errorMessage = err.detail || err.message || GENERIC_ERROR_MESSAGE;
            setError(errorMessage);

            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [clearQuizState]);


    const generateNewQuizFromFile = useCallback(async (file, numQuestions, difficulty) => {
        setLoading(true);
        setError(null);
        clearQuizState();
        try {
            const quizData = await generateQuizFromFile(file, numQuestions, difficulty);


            setCurrentQuiz(quizData);
            return quizData;
        } catch (err) {
            const errorMessage = err.detail || err.message || GENERIC_ERROR_MESSAGE;



            setError(errorMessage);

            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [clearQuizState]);



    const submitQuizAnswers = useCallback(async (quizId, answers) => {
        setLoading(true);
        setError(null);
        setQuizResult(null);
        try {
            const resultData = await submitQuiz(quizId, { answers });
            setQuizResult(resultData);
            return resultData;
        } catch (err) {
            const errorMessage = err.detail || err.message || GENERIC_ERROR_MESSAGE;
            setError(errorMessage);

            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchUserQuizzes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userQuizzes = await getUserQuizzes();
            setQuizzes(userQuizzes);
        } catch (err) {
            const errorMessage = err.detail || err.message || GENERIC_ERROR_MESSAGE;
            setError(errorMessage);

            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchQuizById = useCallback(async (quizId) => {
        setLoading(true);
        setError(null);
        try {
            const quiz = await getQuizById(quizId);
            setCurrentQuiz(quiz);
            return quiz;
        } catch (err) {
            const errorMessage = err.detail || err.message || GENERIC_ERROR_MESSAGE;
            setError(errorMessage);

            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        loading,
        error,
        quizzes,
        currentQuiz,
        quizResult,
        generateNewQuiz,
        generateNewQuizFromFile,
        submitQuizAnswers,
        fetchUserQuizzes,
        fetchQuizById,
        clearQuizState,
    };
};