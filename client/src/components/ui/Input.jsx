import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label, type = 'text', name, placeholder,
  value, onChange, error, hint,
  icon: Icon, required, disabled,
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
          color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            color: focused ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'color var(--dur-normal)', pointerEvents: 'none',
            display: 'flex',
          }}>
            <Icon size={15} strokeWidth={2} />
          </span>
        )}
        <motion.input
          name={name}
          type={isPassword && showPw ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={{
            borderColor: error
              ? 'rgba(255,60,172,0.6)'
              : focused
              ? 'rgba(126,255,245,0.45)'
              : 'rgba(126,255,245,0.08)',
            boxShadow: error
              ? '0 0 0 3px rgba(255,60,172,0.08)'
              : focused
              ? '0 0 0 3px rgba(126,255,245,0.07)'
              : 'none',
          }}
          style={{
            width: '100%',
            padding: `11px ${isPassword ? '42px' : '13px'} 11px ${Icon ? '40px' : '13px'}`,
            background: 'rgba(8, 13, 30, 0.8)',
            border: '1px solid rgba(126,255,245,0.08)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 14, outline: 'none',
            opacity: disabled ? 0.5 : 1,
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>
          {error}
        </motion.span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{hint}</span>
      )}
    </div>
  );
}