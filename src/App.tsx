// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StudentProvider } from './context/StudentContext';
import { useWallet } from './hooks/useWallet';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SuccessPage from './pages/SuccessPage';
import FailedPage from './pages/FailedPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { walletState } = useWallet();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/home"
          element={walletState.connected ? <HomePage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/success"
          element={walletState.connected ? <SuccessPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/failed"
          element={walletState.connected ? <FailedPage /> : <Navigate to="/" replace />}
        />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <div className="App">
          <AppContent />
        </div>
      </StudentProvider>
    </ThemeProvider>
  );
}
