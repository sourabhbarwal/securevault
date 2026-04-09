import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';

export default function TwoFactorPage() {
  const navigate          = useNavigate();
  const location          = useLocation();
  const { completeLogin } = useAuth();

  // userId and password are passed via navigate state from LoginPage
  const { userId, password } = location.state || {};

  const [digits,  setDigits]  = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [shake,   setShake]   = useState(false);

  const inputRefs = useRef([]);

  // If user navigated here directly without going through login — redirect
  useEffect(() => {
    if (!userId) navigate('/login', { replace: true });
  }, [userId, navigate]);

  // Auto-focus the first box on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRefs.current[0]?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  // Handle typing in each box
  const handleDigit = (index, value) => {
    // Only accept single digit 0-9
    if (!/^\d?$/.test(value)) return;

    const next  = [...digits];
    next[index] = value;
    setDigits(next);

    // Auto-jump to next box after typing
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace — go back to previous box
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Allow Enter to submit
    if (e.key === 'Enter') handleVerify();
  };

  // Handle paste — fill all 6 boxes at once
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      toast.error('Enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/auth/2fa/verify', {
        userId,
        totpToken: code,
      });

      // Derive AES key and set global auth state
      await completeLogin(
        data.data.accessToken,
        data.data.user,
        data.data.encryptionSalt,
        password   // master password from login — needed for AES key derivation
      );

      toast.success('Login successful!');
      navigate('/vault', { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code. Try again.');

      // Shake animation to signal wrong code
      setShake(true);
      setTimeout(() => setShake(false), 600);

      // Clear all boxes and refocus first
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);

    } finally {
      setLoading(false);
    }
  };

  const codeComplete = digits.join('').length === 6;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#04060F',
      padding: '24px',
      position: 'relative',
    }}>

      {/* Background orbs — matches the rest of the app */}
      <div style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', overflow: 'hidden',
        zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,60,172,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(126,255,245,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Card */}
      <motion.div
        animate={shake ? { x: [0, -14, 14, -14, 14, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.55 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background: 'rgba(12,20,40,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,60,172,0.18)',
            borderRadius: '24px',
            padding: '48px 40px',
            boxShadow: '0 0 60px rgba(255,60,172,0.09), 0 24px 80px rgba(0,0,0,0.65)',
          }}
        >
          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 68, height: 68,
                borderRadius: 20,
                background: 'rgba(255,60,172,0.12)',
                border: '1px solid rgba(255,60,172,0.32)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 32px rgba(255,60,172,0.22)',
              }}
            >
              <Shield size={32} style={{ color: '#FF3CAC' }} />
            </motion.div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: '26px', fontWeight: 800,
              color: '#E8EDF8', marginBottom: '8px',
            }}>
              2FA Verification
            </h1>
            <p style={{ color: '#7A8AAD', fontSize: '14px', lineHeight: 1.65 }}>
              Enter the 6-digit code from<br />
              <strong style={{ color: '#E8EDF8' }}>Google Authenticator</strong>
            </p>
          </div>

          {/* 6 digit input boxes */}
          <div style={{
            display: 'flex', gap: '10px',
            justifyContent: 'center', marginBottom: '32px',
          }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                autoComplete="off"
                style={{
                  width: '52px', height: '62px',
                  textAlign: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '26px', fontWeight: 700,
                  background: 'rgba(8,13,30,0.9)',
                  color: d ? '#7EFFF5' : '#E8EDF8',
                  border: `2px solid ${d
                    ? 'rgba(126,255,245,0.45)'
                    : 'rgba(126,255,245,0.1)'}`,
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  caretColor: '#7EFFF5',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255,60,172,0.65)';
                  e.target.style.boxShadow   = '0 0 0 3px rgba(255,60,172,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = d
                    ? 'rgba(126,255,245,0.45)'
                    : 'rgba(126,255,245,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading || !codeComplete}
            style={{
              width: '100%', padding: '14px 0',
              background: codeComplete && !loading
                ? 'linear-gradient(135deg, #FF3CAC, #CC2D88)'
                : 'rgba(255,60,172,0.12)',
              border: '1px solid rgba(255,60,172,0.3)',
              borderRadius: '12px',
              color: codeComplete ? '#fff' : '#7A8AAD',
              fontFamily: '"Satoshi", sans-serif',
              fontSize: '16px', fontWeight: 700,
              cursor: loading || !codeComplete ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            {loading
              ? <span style={{
                  width: 20, height: 20,
                  border: '2.5px solid #fff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.65s linear infinite',
                }} />
              : <><Shield size={16} /> Verify Code</>
            }
          </button>

          {/* Back link */}
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              margin: '20px auto 0', background: 'none', border: 'none',
              color: '#7A8AAD', cursor: 'pointer', fontSize: '14px',
              fontFamily: '"Satoshi", sans-serif',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E8EDF8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#7A8AAD'}
          >
            <ArrowLeft size={14} /> Back to login
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}