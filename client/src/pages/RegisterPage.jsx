import React from 'react';
import AuroraBackground from '../components/ui/AuroraBackground';
import Navbar from '../components/layout/Navbar';

export default function RegisterPage() {
  return (
    <div className="font-body text-on-surface min-h-screen bg-background">
      <AuroraBackground />
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
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-outline ml-1">Universal Identifier (Email)</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface font-mono text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="nexus@securevault.io" type="email" />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="alternate_email">alternate_email</span>
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-outline ml-1">Access Fragment (Password)</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface font-mono text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="••••••••••••" type="password" />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="lock_open">lock_open</span>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-primary transition-colors" data-icon="visibility">visibility</span>
                </div>
                
                {/* Password Strength Meter */}
                <div className="pt-3 px-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-tertiary-container">Quantum Resistant Strength</span>
                    <span className="text-[10px] font-mono text-on-surface-variant">85% Secure</span>
                  </div>
                  <div className="flex gap-1.5 h-1">
                    <div className="flex-1 bg-tertiary-container rounded-full"></div>
                    <div className="flex-1 bg-tertiary-container rounded-full"></div>
                    <div className="flex-1 bg-tertiary-container rounded-full"></div>
                    <div className="flex-1 bg-tertiary-container/20 rounded-full"></div>
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-y-2">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-tertiary-container" data-icon="check_circle" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                      <span className="text-[11px] text-on-surface-variant">12+ Characters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-tertiary-container" data-icon="check_circle" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                      <span className="text-[11px] text-on-surface-variant">Mixed Symbology</span>
                    </li>
                    <li className="flex items-center gap-2 opacity-50">
                      <span className="material-symbols-outlined text-[14px] text-outline" data-icon="circle">circle</span>
                      <span className="text-[11px] text-on-surface-variant">Non-Sequential</span>
                    </li>
                    <li className="flex items-center gap-2 opacity-50">
                      <span className="material-symbols-outlined text-[14px] text-outline" data-icon="circle">circle</span>
                      <span className="text-[11px] text-on-surface-variant">Biometric Sync</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-8 flex flex-col gap-4">
                <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-extrabold py-4 px-6 rounded-lg uppercase tracking-wider text-sm shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all" type="button">
                  Initialize Protocol
                </button>
                <p className="text-center text-xs text-on-surface-variant">
                  Already authenticated? <a className="text-primary font-bold hover:underline" href="#">Access Terminal</a>
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
