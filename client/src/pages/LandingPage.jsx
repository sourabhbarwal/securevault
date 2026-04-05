import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary/30 selection:text-primary min-h-screen relative overflow-hidden text-left">
      <div className="aurora-bg"></div>
      {/* TopAppBar Navigation Shell */}
      <header className="bg-[#0b0e18]/80 backdrop-blur-lg docked full-width top-0 z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex justify-between items-center px-8 py-4 w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7EFFF5] text-2xl" data-icon="lock">lock</span>
          <span className="font-['Space_Grotesk'] text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent">SecureVault</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] font-bold tracking-tight">
          <Link className="text-[#7EFFF5] border-b-2 border-[#7EFFF5] pb-1 hover:text-[#7EFFF5] transition-all duration-300" to="/dashboard">Vaults</Link>
          <Link className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300" to="/">Features</Link>
          <Link className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300" to="/">Compliance</Link>
          <Link className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300" to="/">Enterprise</Link>
        </nav>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container-lowest rounded-full px-4 py-1.5 border border-white/5">
            <span className="material-symbols-outlined text-outline text-sm mr-2" data-icon="search">search</span>
            <span className="text-xs text-outline font-label uppercase tracking-widest">Search encrypted indexes</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-[#7EFFF5] transition-all duration-300" data-icon="notifications">notifications</span>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-[#7EFFF5] transition-all duration-300" data-icon="settings">settings</span>
            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
              <img alt="User Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt2taxt9afonvk39GQL0sS1FtGtMc4aoiWmCiDbHNE5WP4uSPDHHtuGluLkBFqm1IcrAY81uUY5ynGnyUQZGEKP4DfhuTnK4yAhc8OUxqVccrvnXF4HkWlRhFV6j11CuzfF3v2dDfYckoK0QKBuTCVtrWSgk5zByF1b5elQp5Omf7Usws5DmSH-1RawckFYHd29sbtMcKqqQnY-wtS0Tl6D3cF8-4YTD7ai-q6lSuGZDIdRemU9lzMqwiqHK02nx_2dDo_VvVWtSc" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen overflow-hidden">
        {/* Floating Particle Dots (Decorative) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full"></div>
          <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-secondary rounded-full"></div>
          <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-primary rounded-full"></div>
          <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-secondary rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-primary rounded-full"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 px-8 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#6ff1e7]"></span>
                <span className="text-[10px] font-label font-bold text-primary uppercase tracking-[0.2em]">Quantum-Ready Encryption v2.4</span>
              </div>
              <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] text-on-surface">
                THE CELESTIAL <br />
                <span className="bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">OBSERVER.</span>
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-xl font-body leading-relaxed">
                Navigate the encrypted cosmos. SecureVault provides a high-fidelity environment for your most sensitive data, utilizing <span className="text-on-surface font-semibold">Zero-Knowledge architecture</span> and sovereign self-hosting.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-label font-bold uppercase tracking-wider rounded-md shadow-[0_10px_25px_-5px_rgba(111,241,231,0.4)] hover:opacity-90 transition-all active:scale-95 inline-flex items-center justify-center">
                  Initialize Vault
                </Link>
                <Link to="/" className="px-8 py-4 bg-transparent border border-white/10 text-on-surface font-label font-bold uppercase tracking-wider rounded-md hover:bg-white/5 transition-all inline-flex items-center justify-center">
                  View Whitepaper
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
              <div className="relative glass-card p-12 rounded-[2rem] border border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.4)] group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="material-symbols-outlined text-[120px] text-primary floating-icon" data-icon="lock_open">lock_open</span>
                  <div className="mt-8 text-center">
                    <span className="font-mono text-xs text-primary/60 block mb-2">ENCRYPTING FRAGMENT: 0x8F2...A92</span>
                    <div className="w-48 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden border border-white/5">
                      <div className="w-2/3 h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-[0_0_10px_#6ff1e7]"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Small Floating Elements */}
              <div className="absolute -top-10 -right-4 glass-card p-4 rounded-xl border border-white/10 transform rotate-12 shadow-2xl">
                <span className="material-symbols-outlined text-secondary" data-icon="terminal">terminal</span>
              </div>
              <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-xl border border-white/10 transform -rotate-6 shadow-2xl">
                <span className="material-symbols-outlined text-primary" data-icon="shield_lock">shield_lock</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="container mx-auto px-8 py-20">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Zero-Knowledge Card */}
            <div className="md:col-span-7 group">
              <div className="h-full glass-card p-10 rounded-2xl border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[140px]" data-icon="vpn_key">vpn_key</span>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-6">
                    <span className="material-symbols-outlined" data-icon="visibility_off">visibility_off</span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold mb-4 tracking-tight">Zero-Knowledge Architecture</h3>
                  <p className="text-on-surface-variant font-body leading-relaxed max-w-md">
                    Your encryption keys never leave your device. Even we cannot see what's inside your vault. Data is fractured and distributed across celestial nodes.
                  </p>
                  <div className="mt-10 font-mono text-sm text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    PROTOCOL: AES-GCM-256-V2
                  </div>
                </div>
              </div>
            </div>

            {/* Self-Hosted Card */}
            <div className="md:col-span-5 group">
              <div className="h-full glass-card p-10 rounded-2xl border border-white/5 hover:border-secondary/40 transition-all duration-500 shadow-2xl bg-gradient-to-b from-surface-container-high/40 to-transparent">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary mb-6">
                  <span className="material-symbols-outlined" data-icon="dns">dns</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-4 tracking-tight">Self-Hosted Sovereignity</h3>
                <p className="text-on-surface-variant font-body leading-relaxed">
                  Deploy your private node on any infrastructure. Full Docker and Kubernetes support for high-availability security.
                </p>
                <div className="mt-12 flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]" data-icon="cloud">cloud</span></div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]" data-icon="database">database</span></div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]" data-icon="router">router</span></div>
                </div>
              </div>
            </div>

            {/* Audit Logs / Terminal Card */}
            <div className="md:col-span-12 group">
              <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-2xl grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-surface-container-lowest p-6 rounded-xl font-mono text-xs border border-white/5 max-h-48 overflow-hidden relative">
                  <div className="flex items-center gap-2 mb-4 text-outline border-b border-white/5 pb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error/50"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container/50"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/50"></span>
                    <span className="ml-2 uppercase tracking-tighter opacity-50">SecureVault Shell v1.0.4</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex gap-4"><span className="text-outline">12:04:22</span> <span className="text-primary">[SUCCESS]</span> Decrypting header...</div>
                    <div className="flex gap-4"><span className="text-outline">12:04:23</span> <span className="text-primary">[SUCCESS]</span> Authentication handshake verified</div>
                    <div className="flex gap-4"><span className="text-outline">12:04:25</span> <span className="text-secondary">[WARNING]</span> Shared link access from unknown IP: 192.168.1.1</div>
                    <div className="flex gap-4"><span className="text-outline">12:04:28</span> <span className="text-primary">[SUCCESS]</span> Vault session locked</div>
                    <div className="flex gap-4"><span className="text-outline">12:05:01</span> <span className="text-outline-variant">&gt; Listening for incoming sync...</span></div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
                </div>
                <div>
                  <h3 className="font-headline text-3xl font-bold mb-4 tracking-tight">Immutable Audit Logs</h3>
                  <p className="text-on-surface-variant font-body leading-relaxed mb-6">
                    Every action is cryptographically signed and recorded. No deletions, no alterations—only pure, untampered transparency for compliance.
                  </p>
                  <a className="inline-flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all" href="#">
                    Explore Tools <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs / Social Proof */}
        <section className="container mx-auto px-8 py-32 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-headline text-5xl font-bold mb-8 leading-tight">Ready to transcend standard security?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-label font-bold uppercase tracking-widest rounded-md shadow-2xl hover:scale-105 transition-transform active:scale-95 inline-flex items-center justify-center">
                Create Personal Vault
              </Link>
              <Link to="/dashboard" className="px-10 py-5 bg-tertiary-container text-on-tertiary-container font-label font-bold uppercase tracking-widest rounded-md hover:bg-tertiary-dim transition-colors inline-flex items-center justify-center">
                Enterprise Inquiry
              </Link>
            </div>
            <div className="mt-16 flex justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
              <span className="font-headline text-2xl font-bold tracking-widest">NEXUS</span>
              <span className="font-headline text-2xl font-bold tracking-widest">AETHER</span>
              <span className="font-headline text-2xl font-bold tracking-widest">QUANTUM</span>
              <span className="font-headline text-2xl font-bold tracking-widest">VOID</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-low border-t border-white/5 py-16 px-8 relative z-20">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7EFFF5]" data-icon="lock">lock</span>
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#7EFFF5]">SecureVault</span>
            </div>
            <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
              The ultimate destination for sovereign data protection and celestial-grade encryption infrastructure.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm" data-icon="alternate_email">alternate_email</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm" data-icon="terminal">terminal</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface">Vaults</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors cursor-pointer">Personal</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Teams</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Enterprise</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Shadow Nodes</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface">Resources</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors cursor-pointer">API Docs</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Security Audits</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Status</li>
              <li className="hover:text-primary transition-colors cursor-pointer">GitHub</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface">Legal</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Sovereignty</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Compliance</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface">Newsletter</h4>
            <div className="flex flex-col gap-2">
              <input className="bg-surface-container-lowest border border-white/5 rounded-md text-xs px-4 py-2 focus:ring-1 focus:ring-primary outline-none" placeholder="orbital@nexus.com" type="email" />
              <button className="bg-primary-container/20 text-primary font-label text-[10px] font-bold uppercase py-2 rounded-md hover:bg-primary-container/30 transition-all">Connect</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-outline">
          <span>© 2024 SECUREVAULT PROTOCOL. ALL RIGHTS RESERVED.</span>
          <span>01010011 01000101 01000011 01010101 01010010 01000101</span>
        </div>
      </footer>
    </div>
  );
}
