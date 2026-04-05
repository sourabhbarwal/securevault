import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages — adjust import paths if your agent named files differently
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
// import TwoFactorPage  from './pages/TwoFactorPage';   // we create this in Phase 15
import VaultDashboard from './pages/VaultDashboard';  // the name your agent used
import SettingsPage   from './pages/SettingsPage';

// ── Route guards ──────────────────────────────────────────
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#04060F' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(126,255,245,0.2)', borderTopColor: '#7EFFF5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function Public({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/vault" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"           element={<Navigate to="/login" replace />} />
      <Route path="/home"       element={<LandingPage />} />
      <Route path="/login"      element={<Public><LoginPage /></Public>} />
      <Route path="/register"   element={<Public><RegisterPage /></Public>} />
      {/* <Route path="/verify-2fa" element={<TwoFactorPage />} /> */}

      {/* Protected routes */}
      <Route path="/vault"    element={<Protected><VaultDashboard /></Protected>} />
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}