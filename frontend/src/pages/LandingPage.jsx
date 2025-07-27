// src/pages/LandingPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
    const { isAuthenticated } = useAuth(); 

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
            <section className="flex flex-col items-center justify-center text-center py-16 px-4 md:py-24 lg:py-32">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight mb-4 animate-fade-in-down">
                    Unlock Knowledge with AI-Powered Quizzes
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mb-8 animate-fade-in">
                    Generate custom multiple-choice quizzes instantly from any topic or even your PDF documents. Get smart explanations for every answer!
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row animate-fade-in-up">
                    {isAuthenticated ? (
                        <>
                            <Link to="/generate-quiz">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
                                    Generate Your Quiz
                                </button>
                            </Link>
                            <Link to="/dashboard">
                                <button className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition duration-300">
                                    Go to Dashboard
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
                                    Sign Up Free
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition duration-300">
                                    Login
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </section>

            <section className="py-16 px-4 bg-white shadow-inner">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">
                    How It Works
                </h2>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-blue-50 shadow-md transform hover:scale-105 transition duration-300">
                        <div className="bg-blue-600 text-white rounded-full p-4 mb-4 text-3xl">
                            💡 
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Smart Quiz Generation</h3>
                        <p className="text-gray-700">
                            Input any topic or upload a PDF document. Our AI analyzes the content to craft relevant and challenging questions.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-green-50 shadow-md transform hover:scale-105 transition duration-300">
                        <div className="bg-green-600 text-white rounded-full p-4 mb-4 text-3xl">
                            ✅ 
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Interactive Quizzes & Results</h3>
                        <p className="text-gray-700">
                            Take your generated quizzes with ease. Get instant scores and see how you performed.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-purple-50 shadow-md transform hover:scale-105 transition duration-300">
                        <div className="bg-purple-600 text-white rounded-full p-4 mb-4 text-3xl">
                            📚 
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Detailed Explanations</h3>
                        <p className="text-gray-700">
                            Understand every answer with comprehensive AI-generated explanations, referencing source content.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                    Ready to Test Your Knowledge?
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                    Join thousands of learners generating smarter quizzes every day. It's free to get started!
                </p>
                <Link to={isAuthenticated ? "/generate-quiz" : "/register"}>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300">
                        {isAuthenticated ? "Start Generating Quizzes" : "Create My Free Account"}
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default LandingPage;