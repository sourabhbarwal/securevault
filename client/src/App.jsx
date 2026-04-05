import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VaultDashboard from './pages/VaultDashboard';
import VaultDashboardDense from './pages/VaultDashboardDense';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<VaultDashboard />} />
      <Route path="/dashboard/dense" element={<VaultDashboardDense />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
