import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Check if user prefers dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newDarkMode = !prev;
      localStorage.setItem('darkMode', newDarkMode);
      
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newDarkMode;
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white dark:bg-surface-800 shadow-sm relative z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M20 8L12 16L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-xl md:text-2xl font-bold ml-2 text-surface-900 dark:text-white">
                Resu<span className="text-primary">Matic</span>
              </h1>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7479 21.1181 10.0794 20.7461C8.41092 20.3741 6.8829 19.5345 5.67415 18.3258C4.4654 17.1171 3.62588 15.5891 3.25391 13.9206C2.88193 12.2521 2.99274 10.5121 3.57346 8.9043C4.15417 7.29651 5.18083 5.88737 6.53321 4.84175C7.88559 3.79614 9.5078 3.15731 11.21 3C10.2134 4.34827 9.73387 6.00945 9.85857 7.68141C9.98327 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0167 16.3186 14.1414C17.9906 14.2661 19.6517 13.7866 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-white dark:bg-surface-800 shadow-sm py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-surface-600 dark:text-surface-400 text-sm">
              © {new Date().getFullYear()} ResuMatic. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="text-sm font-medium"
      />
    </>
  );
};

export default App;