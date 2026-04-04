export default function Badge({ children, color = 'cyan', size = 'sm' }) {
  const colors = {
    cyan:   { bg: 'var(--primary-dim)',  border: 'var(--primary-border)',  text: 'var(--primary)' },
    pink:   { bg: 'var(--accent-dim)',   border: 'var(--accent-border)',   text: 'var(--accent)' },
    lime:   { bg: 'var(--lime-dim)',     border: 'var(--lime-border)',     text: 'var(--lime)' },
    purple: { bg: 'var(--purple-dim)',   border: 'rgba(167,139,250,0.25)', text: 'var(--purple)' },
  };
  const c = colors[color] || colors.cyan;
  const sz = size === 'sm'
    ? { padding: '3px 10px', fontSize: 10 }
    : { padding: '5px 14px', fontSize: 12 };

  return (
    <span style={{
      ...sz,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.06em',
      textTransform: 'uppercase', display: 'inline-block',
    }}>
      {children}
    </span>
  );
}