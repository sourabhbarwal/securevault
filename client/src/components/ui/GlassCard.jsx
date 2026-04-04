import { motion } from 'framer-motion';

export default function GlassCard({
  children, style = {}, hover = true,
  animate = true, onClick, glow = false, glowColor = 'cyan',
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
      whileHover={hover ? { y: -4, borderColor: 'var(--border-hover)' } : undefined}
      onClick={onClick}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: glow
          ? `${glowMap[glowColor]}, var(--shadow-card)`
          : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--dur-normal) var(--ease-smooth)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}