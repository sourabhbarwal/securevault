import AuroraBackground from '../components/background/AuroraBackground';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Lock } from 'lucide-react';

export default function TestPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: 40, position: 'relative' }}>
      <AuroraBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}>
        <GlassCard glow style={{ padding: 32 }}>
          <div className="float" style={{ marginBottom: 20, textAlign: 'center' }}>
            <h1 className="shimmer-text" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>SecureVault UI</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email" placeholder="test@email.com" icon={Lock} hint="Hint text here" />
            <Input label="Password" type="password" placeholder="••••••••" required />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge color="cyan">ENCRYPTED</Badge>
              <Badge color="pink">2FA</Badge>
              <Badge color="lime">VERIFIED</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button>Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <Button loading fullWidth>Loading State</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}