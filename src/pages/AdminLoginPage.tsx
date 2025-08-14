import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Wallet } from "lucide-react";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Auto-redirect if already connected
  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // Connect Petra Wallet
  const connectWallet = async () => {
    try {
      if (window.aptos) {
        const account = await window.aptos.connect();
        localStorage.setItem("walletAddress", account.address);
        navigate("/admin/dashboard");
      } else {
        alert("Petra wallet not found. Please install it first.");
        window.open("https://petra.app/", "_blank");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-500 px-4">
      
      {/* Go Home Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/home")}
        className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all"
      >
        <Home size={18} />
        <span className="text-sm font-medium">Go Home</span>
      </motion.button>

      {/* Connect Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/20 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
        >
          Admin Access
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={connectWallet}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Wallet size={20} />
          Connect Petra Wallet
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
