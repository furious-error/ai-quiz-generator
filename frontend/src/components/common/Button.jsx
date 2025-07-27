// src/components/common/Button.js

import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75
        transition duration-200 ease-in-out text-base

        md:px-6 md:py-3 md:text-lg

        ${disabled
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                }
        ${className} 
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;