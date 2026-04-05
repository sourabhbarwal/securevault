import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function GlassCard({
  children, style = {}, hover = true,
  animate = true, onClick, glow = false, glowColor = 'cyan', className = ""
}) {
  const glowMap = {
    cyan: 'var(--shadow-glow-cyan)',
    pink: 'var(--shadow-glow-pink)',
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -4, borderColor: 'rgba(111, 241, 231, 0.5)' } : undefined}
      onClick={onClick}
      className={clsx('glass-card', className)}
      style={{
        borderRadius: 'var(--radius-lg, 0.5rem)',
        boxShadow: glow
          ? `${glowMap[glowColor]}, var(--shadow-card)`
          : undefined,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}