import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const FailedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, studentDetails } = location.state || {};

  const handleTryAgain = () => {
    navigate('/home', { state: { studentDetails } });
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900 flex items-center justify-center p-4 transition-all duration-500">
      <ThemeToggle />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Error Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.6,
              delay: 0.3,
              ease: 'easeInOut'
            }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mb-4 shadow-xl"
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Payment Failed
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Your transaction could not be completed
          </motion.p>
        </motion.div>

        {/* Error Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What happened?
          </h3>
          
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm">
              {error || 'The transaction was rejected or failed to process. This could be due to insufficient funds, network issues, or user cancellation.'}
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>• Check your wallet balance</p>
            <p>• Ensure network connectivity</p>
            <p>• Try again with a smaller amount</p>
            <p>• Contact support if issues persist</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <motion.button
            onClick={handleTryAgain}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </motion.button>
          
          <motion.button
            onClick={handleGoHome}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FailedPage;