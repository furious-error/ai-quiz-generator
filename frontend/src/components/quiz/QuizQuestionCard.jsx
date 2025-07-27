

import React from 'react';
import QuestionOptions from './QuestionOptions'; 

const QuizQuestionCard = ({
    questionNumber,
    question, 
    selectedOption, 
    onOptionChange, 
    isReviewMode = false,
    correctAnswer, 
}) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-6 w-full max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                <span className="text-blue-600">Question {questionNumber}:</span> {question.question_text}
            </h3>
            <QuestionOptions
                questionId={question.id}
                options={question.options}
                selectedOption={selectedOption}
                onOptionChange={onOptionChange}
                isReviewMode={isReviewMode}
                correctAnswer={correctAnswer || question.correct_answer} 
            />
        </div>
    );
};

export default QuizQuestionCard;