import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useWallet } from './hooks/useWallet';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SuccessPage from './pages/SuccessPage';
import FailedPage from './pages/FailedPage';

const AppContent: React.FC = () => {
  const { walletState } = useWallet();

  return (
    <Router>
      <Routes>
        {/* Default → LoginPage */}
        <Route path="/" element={<LoginPage />} />

        {/* Home page → only if wallet connected */}
        <Route
          path="/home"
          element={
            walletState.connected ? <HomePage /> : <Navigate to="/" replace />
          }
        />

        {/* Success page */}
        <Route
          path="/success"
          element={
            walletState.connected ? <SuccessPage /> : <Navigate to="/" replace />
          }
        />

        {/* Failed page */}
        <Route
          path="/failed"
          element={
            walletState.connected ? <FailedPage /> : <Navigate to="/" replace />
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <AppContent />
      </div>
    </ThemeProvider>
  );
}

export default App;
