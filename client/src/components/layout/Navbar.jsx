import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Vault, Settings, LogOut, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/vault',    label: 'Vault',    icon: Vault },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out securely');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(4,6,15,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Link to="/vault" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div className="glow-cyan" style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7EFFF5, #FF3CAC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={18} color="#04060F" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
          SecureVault
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              background: active ? 'var(--primary-dim)' : 'transparent',
              border: `1px solid ${active ? 'var(--primary-border)' : 'transparent'}`,
              transition: 'all var(--dur-normal)',
            }}>
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user && (
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {user.email.split('@')[0]}
          </span>
        )}
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600 }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}