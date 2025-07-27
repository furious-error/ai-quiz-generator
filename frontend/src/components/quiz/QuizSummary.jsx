// src/components/quiz/QuizSummary.js

import React from 'react';

const QuizSummary = ({ totalQuestions, correctCount, score }) => {
    const percentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(0) : 0;

    return (
        <div className="bg-blue-600 text-white p-6 sm:p-8 rounded-lg shadow-md text-center mb-6 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quiz Results</h2>
            <p className="text-xl md:text-2xl mb-2">
                You scored: <span className="font-extrabold">{score}</span> points
            </p>
            <p className="text-lg md:text-xl">
                Correct Answers: <span className="font-bold">{correctCount}</span> out of{' '}
                <span className="font-bold">{totalQuestions}</span> ({percentage}%)
            </p>
        </div>
    );
};

export default QuizSummary;