import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';
import { StudentDetails } from '../types';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // UseMemo to avoid re-reading location.state on every render
  const { studentDetails, transactionHash } = useMemo(() => {
    return location.state || {};
  }, [location.state]);

  // ✅ Save payment to backend when page loads
  useEffect(() => {
    if (studentDetails && transactionHash) {
      axios.post('http://localhost:5000/api/payments', {
        ...studentDetails,
        transactionHash,
        status: 'success',
        date: new Date().toISOString()
      })
      .then(() => {
        console.log('Payment saved successfully');
      })
      .catch(err => {
        console.error('Error saving payment:', err);
      });
    }
  }, [studentDetails, transactionHash]);

  const handleGoHome = () => {
    navigate('/home', { replace: true });
  };

  const handleCopyHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
      alert('Transaction hash copied to clipboard!');
    }
  };

  const handleDownloadReceipt = () => {
    if (!studentDetails) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('AptosEdu Pay', 20, 30);
    doc.setFontSize(16);
    doc.text('Payment Receipt', 20, 45);
    doc.line(20, 55, 190, 55);

    doc.setFontSize(12);
    doc.text(`Student Name: ${studentDetails.studentName}`, 20, 70);
    doc.text(`College Name: ${studentDetails.collegeName}`, 20, 85);
    doc.text(`Year: ${studentDetails.year}`, 20, 100);
    doc.text(`Course: ${studentDetails.course}`, 20, 115);
    doc.text(`Roll Number: ${studentDetails.rollNumber}`, 20, 130);
    doc.text(`Fee Type: ${studentDetails.feeType}`, 20, 145);
    doc.text(`Amount: ${studentDetails.amount} APT`, 20, 160);

    if (transactionHash) {
      doc.text(`Transaction Hash:`, 20, 175);
      doc.setFontSize(10);
      doc.text(transactionHash, 20, 185);
    }

    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 200);
    doc.text(`Status: Payment Successful`, 20, 215);

    doc.save('payment-receipt.pdf');
  };

  if (!studentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No transaction data found
          </h2>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900 flex items-center justify-center p-4 transition-all duration-500">
      <ThemeToggle />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Your fee payment has been processed successfully
          </motion.p>
        </motion.div>

        {/* Transaction Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transaction Details
          </h3>
          <div className="space-y-3">
            <Detail label="Student" value={studentDetails.studentName} />
            <Detail label="College" value={studentDetails.collegeName} />
            <Detail label="Year" value={studentDetails.year} />
            <Detail label="Roll Number" value={studentDetails.rollNumber} />
            <Detail label="Course" value={studentDetails.course} />
            <Detail label="Fee Type" value={studentDetails.feeType} />
            <Detail label="Amount" value={`${studentDetails.amount} APT`} highlight />
            {transactionHash && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Transaction Hash:
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
                  {transactionHash}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={handleDownloadReceipt}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Detail = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 dark:text-gray-300">{label}:</span>
    <span className={`font-medium ${highlight ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-900 dark:text-white'}`}>
      {value}
    </span>
  </div>
);

export default SuccessPage;
