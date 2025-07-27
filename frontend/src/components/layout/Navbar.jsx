// src/components/layout/Navbar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import Button from '../common/Button'; 

const Navbar = () => {
    const { currentUser, isAuthenticated, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false); 

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-blue-700 p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <Link to="/" className="text-white text-2xl font-bold tracking-wide flex-shrink-0">
                    AI Quiz Generator
                </Link>
                <div className="block lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white"
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="fill-current h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-6z" />
                        </svg>
                    </button>
                </div>

                <div
                    className={`${isOpen ? 'block' : 'hidden'
                        } w-full lg:flex lg:items-center lg:w-auto mt-4 lg:mt-0`}
                >
                    <div className="text-sm lg:flex-grow flex flex-col lg:flex-row items-stretch lg:items-center">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/generate-quiz"
                                    className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4 py-2 lg:py-0 px-3 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                                    onClick={() => setIsOpen(false)} 
                                >
                                    Generate Quiz
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4 py-2 lg:py-0 px-3 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Quizzes
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4 py-2 lg:py-0 px-3 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4 py-2 lg:py-0 px-3 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="mt-4 lg:mt-0 flex flex-col lg:flex-row items-stretch lg:items-center">
                        {isAuthenticated && currentUser ? (
                            <>
                                <span className="text-white text-sm lg:text-base mr-4 py-2 lg:py-0 text-center lg:text-left">
                                    Welcome, {currentUser.email.split('@')[0]}!
                                </span>
                                <Button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="
                    bg-blue-500 hover:bg-blue-400 text-white font-bold
                    py-2 px-4 rounded-md transition duration-150 ease-in-out
                    w-full lg:w-auto
                  "
                                >
                                    Logout
                                </Button>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;