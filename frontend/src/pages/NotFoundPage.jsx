// src/pages/NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

function NotFoundPage() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8 text-center">
            <h1 className="text-6xl sm:text-8xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
                Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
                <Button className="py-3 px-8 text-lg bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">
                    Go to Homepage
                </Button>
            </Link>
        </div>
    );
}

export default NotFoundPage;