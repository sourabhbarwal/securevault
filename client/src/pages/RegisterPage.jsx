  import React from 'react';
  import Navbar from '../components/layout/Navbar';
  import { useState } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import toast from 'react-hot-toast';
  import axios from '../api/axiosInstance';

  export default function RegisterPage() {
    const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  // const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  // Password strength: 0-4
  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))        s++;
    if (/[0-9]/.test(pw))        s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(password);
  const STRENGTH_LABELS = ['',  'Weak',    'Fair',    'Good',    'Strong'];
  const STRENGTH_COLORS = ['',  '#FF3CAC', '#f59e0b', '#7EFFF5', '#C8FF57'];

  const validate = () => {
    const e = {};
    if (!email)   e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(password)) e.password = 'Need one uppercase letter';
    else if (!/[0-9]/.test(password)) e.password = 'Need one number';
    // if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post('/auth/register', { email, password });
      toast.success('Account created! Check your email to verify.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
    return (
      <div className="font-body text-on-surface min-h-screen bg-background">
        <div className="aurora-bg" />
        <div className="fixed inset-0 particle-dots pointer-events-none z-0" />
        <Navbar />

        {/* Main Content Canvas */}
        <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
          <div className="max-w-4xl w-full grid md:grid-cols-5 gap-0 glass-card rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_rgba(126,255,245,0.05)]">
            
            {/* Sidebar Progress (Asymmetric layout hint) */}
            <div className="md:col-span-2 bg-surface-container-low p-10 border-r border-white/5 flex flex-col justify-between">
              <div>
                <h1 className="font-headline text-4xl font-extrabold text-on-surface leading-tight mb-4">
                  Initialize Your<br />Safe Passage.
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-12">
                  Establish your unique cryptographic signature across the SecureVault network. Your privacy is our prime directive.
                </p>
                
                {/* Stepper */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center bg-primary/10 text-primary font-bold">1</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary tracking-wider uppercase">Identity</span>
                      <span className="text-xs text-on-surface-variant">Core Account Setup</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center text-outline-variant font-bold">2</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-wider uppercase">V-Auth</span>
                      <span className="text-xs">Security Verification</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center text-outline-variant font-bold">3</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-wider uppercase">Vaults</span>
                      <span className="text-xs">Initial Configuration</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-12">
                <div className="p-4 bg-surface-container-lowest rounded-lg border border-white/5">
                  <p className="text-[10px] font-mono text-outline uppercase tracking-[0.2em] mb-2">Encryption Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-tertiary-container"></div>
                    <span className="text-xs font-mono text-tertiary-container">AES-256 ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form Area */}
            <div className="md:col-span-3 p-10 md:p-14 relative bg-surface-container-low md:bg-transparent">
              <div className="mb-10">
                <h2 className="font-headline text-2xl font-bold mb-2">Account Setup</h2>
                <p className="text-on-surface-variant text-sm">Step 1 of 3: Define your access credentials.</p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-outline ml-1">Universal Identifier (Email)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface font-mono text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="nexus@securevault.io" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    {errors.email && (
                      <p style={{ color: '#FF3CAC', fontSize: '12px', marginTop: '4px' }}>
                        {errors.email}
                      </p>
                    )}
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="alternate_email">alternate_email</span>
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-outline ml-1">Access Fragment (Password)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface font-mono text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="••••••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="lock_open">lock_open</span>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-primary transition-colors" data-icon="visibility">visibility</span>
                  </div>

                    {password.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1, height: '3px', borderRadius: '2px',
                                background: i <= strength
                                  ? STRENGTH_COLORS[strength]
                                  : 'rgba(126,255,245,0.08)',
                                transition: 'background 0.3s',
                              }}
                            />
                          ))}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: STRENGTH_COLORS[strength],
                          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                        }}>
                          {STRENGTH_LABELS[strength]}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p style={{ color: '#FF3CAC', fontSize: '12px', marginTop: '4px' }}>
                        {errors.password}
                      </p>
                    )}
                </div>

                {/* CTA Section */}
                <div className="pt-8 flex flex-col gap-4">
                  <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-extrabold py-4 px-6 rounded-lg uppercase tracking-wider text-sm shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all" type="submit" disabled={loading}>
                    {loading ? 'Initializing...' : 'Initialize Protocol'}
                  </button>
                  <p className="text-center text-xs text-on-surface-variant">
                    Already authenticated?{' '}
                    <Link className='text-primary font-bold hover:underline' to="/login">
                      Access Terminal
                    </Link>
                  </p>
                </div>
              </form>

              {/* Floating Info Card (Asymmetric detail) */}
              <div className="mt-12 p-5 bg-surface-container-high/40 rounded-xl border border-white/5 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/5">
                  <span className="material-symbols-outlined text-primary" data-icon="security_update_good">security_update_good</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-1 uppercase tracking-tight">Zero-Knowledge Proof</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">SecureVault never stores your raw password. We use salted hashing and client-side encryption, meaning even we can't see your data.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Meta */}
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[10px] font-mono text-outline uppercase tracking-[0.2em] opacity-60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Node: US-EAST-01
          </div>
          <div>System Version: 4.8.2-OMEGA</div>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
          </div>
        </footer>
      </div>
    );
  }
