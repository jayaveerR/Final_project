import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Building, Hash, CreditCard, DollarSign } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { shortenAddress, sendTransaction } from '../utils/wallet';
import { StudentDetails } from '../types';
import ThemeToggle from '../components/ThemeToggle';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState, setWalletState } = useWallet();
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    studentName: '',
    collegeName: '',
    year: '',
    course: '',
    rollNumber: '',
    feeType: 'College Fee',
    amount: 0
  });

  const feeTypes = ['College Fee', 'Event Fee', 'CRT Fee', 'Hostel Fee', 'Others'];

  // Logout / Disconnect
  const handleLogout = () => {
    setWalletState({ connected: false, address: null, balance: 0 });
    navigate('/');
  };

  const handleInputChange = (field: keyof StudentDetails, value: string | number) => {
    setStudentDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePayFee = async () => {
    if (!studentDetails.studentName || !studentDetails.collegeName ||
        !studentDetails.rollNumber || !studentDetails.amount) {
      alert('Please fill all fields');
      return;
    }

    if (studentDetails.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    setLoading(true);

    const institutionAddress = '0x1'; // Replace with actual wallet address

    try {
      const result = await sendTransaction(institutionAddress, studentDetails.amount);

      if (result.success) {
        navigate('/success', {
          state: {
            studentDetails,
            transactionHash: result.hash
          }
        });
      } else {
        navigate('/failed', {
          state: {
            error: result.error,
            studentDetails
          }
        });
      }
    } catch (error) {
      navigate('/failed', {
        state: {
          error: 'Transaction failed',
          studentDetails
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <ThemeToggle />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AptosEdu Pay
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {shortenAddress(walletState.address || '')}
              </span>
            </div>
            {/* Disconnect Button */}
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Disconnect
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pay Your Fees
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your details to make a secure payment
            </p>
          </div>

          <div className="space-y-6">
            {/* Student Name */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" /> Student Name
              </label>
              <input
                type="text"
                value={studentDetails.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
              />
            </motion.div>

            {/* College Name */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" /> College Name
              </label>
              <input
                type="text"
                value={studentDetails.collegeName}
                onChange={(e) => handleInputChange('collegeName', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                placeholder="Enter your college name"
              />
            </motion.div>

            {/* Year */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
              <input
                type="text"
                value={studentDetails.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                placeholder="e.g., 1st Year, 2nd Year"
              />
            </motion.div>

            {/* Course */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.575 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
              <select
                value={studentDetails.course || ''}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              >
                <option value="">Select Course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="B.Sc">B.Sc</option>
                <option value="M.Sc">M.Sc</option>
                <option value="MBA">MBA</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            {/* Roll Number */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Hash className="w-4 h-4 inline mr-2" /> Roll Number
              </label>
              <input
                type="text"
                value={studentDetails.rollNumber}
                onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                placeholder="Enter your roll number"
              />
            </motion.div>

            {/* Fee Type */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" /> Fee Type
              </label>
              <select
                value={studentDetails.feeType}
                onChange={(e) => handleInputChange('feeType', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              >
                {feeTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </motion.div>

            {/* Amount */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" /> Amount (APT)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={studentDetails.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </motion.div>

            {/* Pay Button */}
            <motion.button
              onClick={handlePayFee}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  <span>Pay Fee</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
