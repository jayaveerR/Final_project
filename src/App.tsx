import React, { useEffect } from 'react';
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
        <Route 
          path="/" 
          element={
            walletState.connected ? <Navigate to="/home" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/" 
          element={
            walletState.connected ? <HomePage /> : <Navigate to="/" replace />  
          } 
        />
        <Route 
          path="/home" 
          element={
            walletState.connected ? <HomePage /> : <Navigate to="/" replace />
          }
        />
        <Route 
          path="/success" 
          element={
            walletState.connected ? <SuccessPage /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/failed" 
          element={
            walletState.connected ? <FailedPage /> : <Navigate to="/LoginPage" replace />
          } 
        />
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