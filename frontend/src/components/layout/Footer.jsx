// src/components/layout/Footer.js

import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center mt-auto shadow-inner">
            <div className="container mx-auto text-sm md:text-base">
                <p>&copy; {new Date().getFullYear()} AI Quiz Generator. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;