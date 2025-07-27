

import React from 'react';
import QuestionOptions from './QuestionOptions'; 

const ExplanationCard = ({ questionResult }) => {
    const {
        question_id, 
        question_text,
        options,
        selected_option,
        correct_answer,
        is_correct,
        explanation,
    } = questionResult;

    const resultStatusClass = is_correct
        ? 'border-green-500 bg-green-50 text-green-800'
        : 'border-red-500 bg-red-50 text-red-800';

    const resultStatusText = is_correct ? 'Correct!' : 'Incorrect!';

    return (
        <div className={`
      bg-white p-6 sm:p-8 rounded-lg shadow-md mb-6 w-full max-w-3xl mx-auto
      border-l-4 ${resultStatusClass}
    `}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Question: {question_text}
                </h3>
                <span className={`
          px-3 py-1 rounded-full text-sm font-bold
          ${is_correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}
        `}>
                    {resultStatusText}
                </span>
            </div>

            <p className="text-gray-700 text-base mb-4">Your Answer: <span className="font-semibold">{selected_option || "Not Answered"}</span></p>

            <QuestionOptions
                questionId={question_id}
                options={options}
                selectedOption={selected_option}
                correctAnswer={correct_answer}
                isReviewMode={true} 
            />

            <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Explanation:</h4>
                <p className="text-gray-700 text-base leading-relaxed">{explanation}</p>
            </div>
        </div>
    );
};

export default ExplanationCard;