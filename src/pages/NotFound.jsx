import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const FileNotFoundIcon = getIcon('file-x');
const HomeIcon = getIcon('home');

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="page-container flex flex-col items-center justify-center py-16 md:py-24"
    >
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 text-primary">
          <FileNotFoundIcon className="w-full h-full" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-900 dark:text-white">
          404
        </h1>
        
        <p className="text-xl md:text-2xl font-semibold mb-3 text-surface-800 dark:text-surface-200">
          Page Not Found
        </p>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-balance">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to creating your resume.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center btn btn-primary px-6 py-3"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;