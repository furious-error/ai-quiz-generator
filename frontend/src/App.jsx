// src/App.js

import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';          
import Navbar from './components/layout/Navbar';       
import Footer from './components/layout/Footer';       
import './index.css';

function App() {
  return (
      <AuthProvider>
        <div className="flex flex-col min-h-screen font-inter">
          <Navbar />
          <main className="flex-grow relative">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
  );
}

export default App;