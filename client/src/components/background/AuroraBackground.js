import { useMemo } from 'react';

export default function AuroraBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: i % 4 === 0 ? '#7EFFF5' : i % 4 === 1 ? '#FF3CAC' : i % 4 === 2 ? '#C8FF57' : '#fff',
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }))
  , []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Cyan aurora orb */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(126,255,245,0.07) 0%, transparent 70%)', filter: 'blur(70px)', animation: 'aurora 22s linear infinite' }} />
      {/* Magenta aurora orb */}
      <div style={{ position: 'absolute', bottom: '8%', right: '5%', width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,60,172,0.06) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'aurora 28s linear infinite reverse' }} />
      {/* Lime accent */}
      <div style={{ position: 'absolute', top: '3%', right: '22%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,255,87,0.04) 0%, transparent 70%)', filter: 'blur(55px)', animation: 'float-slow 14s ease-in-out infinite' }} />
      {/* Stars */}
      {stars.map(s => (
        <div key={s.id} style={{ position: 'absolute', width: s.size, height: s.size, borderRadius: '50%', background: s.color, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity, animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
      ))}
      {/* Scan line */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(126,255,245,0.15), transparent)', animation: 'scan 12s linear 1s infinite' }} />
    </div>
  );
}