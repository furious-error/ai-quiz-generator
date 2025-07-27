// src/components/quiz/QuestionOptions.js

import React from 'react';

const QuestionOptions = ({
    questionId,
    options,
    selectedOption,
    onOptionChange, 
    correctAnswer,  
    isReviewMode = false, 
}) => {
    return (
        <div className="space-y-3 mt-4">
            {options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = isReviewMode && option === correctAnswer;
                const isIncorrectSelected = isReviewMode && isSelected && !isCorrectOption;

                let optionClass = `
          block w-full text-left py-3 px-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500
          hover:shadow-md
        `;

                if (isReviewMode) {
                    if (isCorrectOption) {
                        optionClass += ' border-green-500 bg-green-50 text-green-800 shadow-md'; 
                    } else if (isIncorrectSelected) {
                        optionClass += ' border-red-500 bg-red-50 text-red-800 shadow-md'; 
                    } else if (isSelected) {
                        optionClass += ' border-gray-400 bg-gray-100 text-gray-700'; 
                    } else {
                        optionClass += ' border-gray-200 bg-white text-gray-800 hover:border-gray-300'; 
                    }
                } else {
                    
                    optionClass += `
            ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md' : 'border-gray-200 bg-white text-gray-800'}
            hover:border-blue-300 hover:bg-blue-50
          `;
                }

                return (
                    <label key={index} className={optionClass}>
                        <input
                            type="radio"
                            name={`question-${questionId}`} 
                            value={option}
                            checked={isSelected}
                            onChange={() => !isReviewMode && onOptionChange(option)} 
                            disabled={isReviewMode} 
                            className="mr-3 transform scale-125 accent-blue-600" 
                        />
                        {option}
                    </label>
                );
            })}
        </div>
    );
};

export default QuestionOptions;