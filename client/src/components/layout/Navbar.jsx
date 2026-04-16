import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence }        from 'framer-motion';
import { Lock, Shield, Settings, LogOut, Vault, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import toast        from 'react-hot-toast';
import { useAuth }  from '../../context/AuthContext';

const NAV_LINKS = [
  { path: '/vault',    label: 'Vault',    icon: Vault    },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on auth pages
  const authPages = ['/login', '/register', '/verify-2fa'];
  if (authPages.includes(location.pathname)) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out securely');
      navigate('/login', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 200,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: '64px',
        background: 'rgba(4,6,15,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(126,255,245,0.07)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <Link
        to="/vault"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: '9px',
          background: 'linear-gradient(135deg, #7EFFF5, #FF3CAC)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(126,255,245,0.25)',
        }}>
          <Lock size={17} color="#04060F" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: '"Syne", sans-serif', fontSize: '18px', fontWeight: 800, color: '#E8EDF8' }}>
          SecureVault
        </span>
      </Link>

      {/* ── Nav links ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {NAV_LINKS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px', fontWeight: active ? 600 : 400,
                color: active ? '#7EFFF5' : '#7A8AAD',
                background: active ? 'rgba(126,255,245,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(126,255,245,0.2)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#E8EDF8';
                  e.currentTarget.style.background = 'rgba(126,255,245,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#7A8AAD';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── User section ─────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen((p) => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 14px', borderRadius: '10px',
            background: 'rgba(126,255,245,0.06)',
            border: '1px solid rgba(126,255,245,0.1)',
            color: '#E8EDF8', cursor: 'pointer',
            fontFamily: '"Satoshi", sans-serif', fontSize: '14px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(126,255,245,0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(126,255,245,0.1)'}
        >
          {/* Avatar initial */}
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(126,255,245,0.3), rgba(255,60,172,0.3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: '#E8EDF8',
          }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>

          {/* Email */}
          <span style={{
            maxWidth: '140px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontSize: '13px', color: '#7A8AAD',
          }}>
            {user?.email || 'User'}
          </span>

          {/* 2FA badge */}
          {user?.isTwoFactorEnabled && (
            <Shield size={12} style={{ color: '#C8FF57' }} title="2FA Active" />
          )}

          <ChevronDown
            size={14}
            style={{
              color: '#7A8AAD',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }}
          />
        </button>

        {/* ── Dropdown ─────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                minWidth: '200px',
                background: '#0C1428',
                border: '1px solid rgba(126,255,245,0.1)',
                borderRadius: '14px', padding: '8px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                zIndex: 300,
              }}
            >
              {/* User info */}
              <div style={{
                padding: '10px 12px 14px',
                borderBottom: '1px solid rgba(126,255,245,0.06)',
                marginBottom: '6px',
              }}>
                <p style={{ fontSize: '12px', color: '#3D4F70', marginBottom: '2px' }}>Signed in as</p>
                <p style={{
                  fontSize: '13px', color: '#E8EDF8', fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user?.email}
                </p>
                {user?.isTwoFactorEnabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                    <Shield size={11} style={{ color: '#C8FF57' }} />
                    <span style={{ fontSize: '11px', color: '#C8FF57' }}>2FA Enabled</span>
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                style={{
                  width: '100%', padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'none', border: 'none', borderRadius: '8px',
                  color: '#FF3CAC', cursor: 'pointer',
                  fontSize: '14px', fontFamily: '"Satoshi", sans-serif',
                  textAlign: 'left', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,60,172,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click-outside overlay */}
        {menuOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 250 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </motion.nav>
  );
}