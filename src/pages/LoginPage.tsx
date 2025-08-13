import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, Zap } from 'lucide-react';
import { connectPetraWallet, isPetraInstalled } from '../utils/wallet';
import { useWallet } from '../hooks/useWallet';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setWalletState } = useWallet();

  const handleConnectWallet = async () => {
    if (!isPetraInstalled()) {
      alert('Please install Petra Wallet extension to continue.');
      window.open('https://petra.app/', '_blank');
      return;
    }

    try {
      const address = await connectPetraWallet();
      setWalletState({
        connected: true,
        address,
        balance: 0
      });
      navigate('/home');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 transition-all duration-500">
      <ThemeToggle />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-xl">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AptosEdu Pay
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Secure fee payments on Aptos blockchain
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Connect Your Wallet
          </h2>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Secure Transactions</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Protected by Aptos blockchain</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Fast Payments</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Instant fee processing</p>
              </div>
            </motion.div>
          </div>

          {/* Connect Button */}
          <motion.button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Wallet className="w-6 h-6" />
            <span>Connect Petra Wallet</span>
          </motion.button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;