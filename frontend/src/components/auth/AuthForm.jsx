// src/components/auth/AuthForm.js

import React from 'react';
import Button from '../common/Button'; 
import LoadingSpinner from '../common/LoadingSpinner'; 

const AuthForm = ({
    title,
    submitButtonText,
    onSubmit,
    children, 
    error,
    loading,
    footerContent 
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="
        bg-white p-6 sm:p-8 rounded-lg shadow-xl
        w-full max-w-sm 
        md:max-w-md     
        lg:max-w-lg     
        mx-auto         
      "
        >
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                {title}
            </h2>

            {error && (
                <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                    {error}
                </p>
            )}

            {children}

            <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 sm:py-3 mt-6 text-lg" 
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" /> {submitButtonText}...
                    </div>
                ) : (
                    submitButtonText
                )}
            </Button>

            {footerContent && (
                <div className="text-center text-sm text-gray-600 mt-4">
                    {footerContent}
                </div>
            )}
        </form>
    );
};

export default AuthForm;