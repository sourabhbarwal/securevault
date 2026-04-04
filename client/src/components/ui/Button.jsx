import { motion } from 'framer-motion';

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #7EFFF5, #4DD9CC)',
    color: '#04060F', fontWeight: 700, border: 'none',
  },
  accent: {
    background: 'linear-gradient(135deg, #FF3CAC, #CC2D88)',
    color: '#fff', fontWeight: 700, border: 'none',
  },
  outline: {
    background: 'var(--primary-dim)', color: 'var(--primary)',
    border: '1px solid var(--primary-border)', fontWeight: 600,
  },
  ghost: {
    background: 'transparent', color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'var(--accent-dim)', color: 'var(--accent)',
    border: '1px solid var(--accent-border)', fontWeight: 600,
  },
};

const SIZES = {
  sm: { padding: '7px 14px', fontSize: 13, borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 22px', fontSize: 14, borderRadius: 'var(--radius-md)' },
  lg: { padding: '13px 30px', fontSize: 16, borderRadius: 'var(--radius-md)' },
  xl: { padding: '16px 44px', fontSize: 17, borderRadius: 'var(--radius-lg)' },
};

export default function Button({
  children, variant = 'primary', size = 'md',
  loading, disabled, fullWidth, icon: Icon,
  type = 'button', onClick, style = {},
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        ...VARIANTS[variant],
        ...SIZES[size],
        ...style,
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        position: 'relative', overflow: 'hidden',
        transition: 'all var(--dur-normal)',
      }}
    >
      {loading
        ? <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        : <>{Icon && <Icon size={15} strokeWidth={2} />}{children}</>
      }
    </motion.button>
  );
}