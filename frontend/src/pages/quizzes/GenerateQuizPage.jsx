// src/pages/quizzes/GenerateQuizPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../hooks/useQuiz';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
    MIN_QUESTIONS,
    MAX_QUESTIONS,
    DIFFICULTY_LEVELS,
    DEFAULT_QUIZ_TOPIC,
    DEFAULT_NUM_QUESTIONS,
    DEFAULT_DIFFICULTY,
    GENERIC_ERROR_MESSAGE,
    RATE_LIMIT_MESSAGE
} from '../../utils/constants';

function GenerateQuizPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const {
        generateNewQuiz, 
        generateNewQuizFromFile,
        loading: quizLoading,
        error: quizError,
        currentQuiz,
        clearQuizState
    } = useQuiz();
    const navigate = useNavigate();

    const [topic, setTopic] = useState(DEFAULT_QUIZ_TOPIC);
    const [numQuestions, setNumQuestions] = useState(DEFAULT_NUM_QUESTIONS);
    const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
    const [selectedFile, setSelectedFile] = useState(null); 
    const [generationMode, setGenerationMode] = useState('topic'); 

    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        clearQuizState();
    }, [clearQuizState]);

    useEffect(() => {
        if (currentQuiz && currentQuiz._id) {
            // console.log("GenerateQuizPage DEBUG: Navigating to take-quiz with ID:", currentQuiz._id);
            navigate(`/take-quiz/${currentQuiz._id}`);
        }
    }, [currentQuiz, navigate]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setFormError('Only PDF files are allowed.');
                setSelectedFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setFormError('File size exceeds 5MB limit.');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setFormError(null);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); 

        if (numQuestions < MIN_QUESTIONS || numQuestions > MAX_QUESTIONS) {
            setFormError(`Number of questions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}.`);
            return;
        }
        if (!DIFFICULTY_LEVELS.includes(difficulty)) {
            setFormError('Invalid difficulty selected.');
            return;
        }
        try {
            if (generationMode === 'topic') {
                if (!topic.trim()) {
                    setFormError('Quiz Topic cannot be empty.');
                    return;
                }
                await generateNewQuiz(topic, numQuestions, difficulty);
            } else { 
                if (!selectedFile) {
                    setFormError('Please select a PDF file to upload.');
                    return;
                }
                await generateNewQuizFromFile(selectedFile, numQuestions, difficulty);
            }
        } catch (err) {
            const displayError = quizError || err.message || GENERIC_ERROR_MESSAGE;
            setFormError(displayError);
        }
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                    Generate Your Custom Quiz
                </h1>

                {formError && (
                    <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                        {formError}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <label className="inline-flex items-center mr-4">
                            <input
                                type="radio"
                                name="generationMode"
                                value="topic"
                                checked={generationMode === 'topic'}
                                onChange={() => {
                                    setGenerationMode('topic');
                                    setFormError(null); 
                                    setSelectedFile(null); 
                                }}
                                className="form-radio text-blue-600 h-4 w-4"
                            />
                            <span className="ml-2 text-gray-700 text-base md:text-lg font-medium">From Topic</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="generationMode"
                                value="file"
                                checked={generationMode === 'file'}
                                onChange={() => {
                                    setGenerationMode('file');
                                    setFormError(null); 
                                    setTopic(DEFAULT_QUIZ_TOPIC); 
                                }}
                                className="form-radio text-blue-600 h-4 w-4"
                            />
                            <span className="ml-2 text-gray-700 text-base md:text-lg font-medium">From PDF File</span>
                        </label>
                    </div>

                    {generationMode === 'topic' ? (
                        <InputField
                            id="topic"
                            label="Quiz Topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                            placeholder="e.g., Python Programming, World History, Solar System"
                            className="text-base"
                        />
                    ) : (
                        <div>
                            <label htmlFor="pdfFile" className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                                Upload PDF File (Max 5MB)
                            </label>
                            <input
                                type="file"
                                id="pdfFile"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {selectedFile && (
                                <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="numQuestions" className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                            Number of Questions ({MIN_QUESTIONS}-{MAX_QUESTIONS})
                        </label>
                        <select
                            id="numQuestions"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                            required
                        >
                            {Array.from({ length: MAX_QUESTIONS - MIN_QUESTIONS + 1 }, (_, i) => MIN_QUESTIONS + i).map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="difficulty" className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                            required
                        >
                            {DIFFICULTY_LEVELS.map(level => (
                                <option key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        type="submit"
                        disabled={quizLoading}
                        className="w-full py-2 sm:py-3 mt-6 text-lg"
                    >
                        {quizLoading ? (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner size="sm" className="mr-2" /> Generating Quiz...
                            </div>
                        ) : (
                            'Generate Quiz'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default GenerateQuizPage;