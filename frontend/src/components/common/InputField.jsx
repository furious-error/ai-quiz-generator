// src/components/common/InputField.js

import React from 'react';

const InputField = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    placeholder = '',
    className = '',
    labelClassName = '',
    containerClassName = '',
    error = null,
    ...props
}) => {
    return (
        <div className={`mb-4 ${containerClassName}`}>
            <label htmlFor={id} className={`block text-gray-700 text-sm md:text-base font-bold mb-2 ${labelClassName}`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`
          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          text-sm md:text-base

          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );
};

export default InputField;