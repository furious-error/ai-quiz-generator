// src/components/common/LoadingSpinner.js

import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    let spinnerSize;
    switch (size) {
        case 'sm':
            spinnerSize = 'w-4 h-4';
            break;
        case 'md':
            spinnerSize = 'w-8 h-8';
            break;
        case 'lg':
            spinnerSize = 'w-12 h-12';
            break;
        default:
            spinnerSize = 'w-8 h-8';
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`
          ${spinnerSize} border-2 border-t-2 border-blue-500 border-solid rounded-full
          animate-spin
        `}
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;