import React from 'react';

export default function LoginPage() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary/30 min-h-screen overflow-hidden relative">
      {/* Atmospheric Layers */}
      <div className="fixed inset-0 aurora-bg z-0"></div>
      <div className="fixed inset-0 particle-grid z-0"></div>
      <div className="scanline"></div>
      
      {/* Navigation Shell (Suppressed items except Identity for Login) */}
      <header className="fixed top-0 z-50 w-full flex justify-between items-center px-8 py-4 bg-[#0b0e18]/80 backdrop-blur-lg border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7EFFF5] text-3xl" data-icon="lock">lock</span>
          <span className="text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">SecureVault</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-slate-400 font-medium font-['Space_Grotesk'] text-sm hover:text-[#7EFFF5] transition-all duration-300" href="#">System Status</a>
          <a className="text-slate-400 font-medium font-['Space_Grotesk'] text-sm hover:text-[#7EFFF5] transition-all duration-300" href="#">Documentation</a>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        {/* Login Card: The Celestial Observer */}
        <div className="w-full max-w-md bg-surface-container-high/40 backdrop-blur-[24px] p-10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_25px_rgba(111,241,231,0.08)] border border-outline-variant/15 hover:border-primary/40 transition-all duration-500 group">
          <div className="mb-10 text-center">
            <h1 className="font-headline text-4xl font-black tracking-tighter text-on-background mb-3">
              ACCESS <span className="text-primary">VAULT</span>
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">IDENTIFICATION REQUIRED FOR QUANTUM DECRYPTION</p>
          </div>
          <form className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-headline font-bold uppercase tracking-widest text-outline ml-1">Terminal ID (Email)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="alternate_email">alternate_email</span>
                <input className="w-full bg-surface-container-lowest border-none py-4 pl-12 pr-4 rounded-lg font-mono text-sm text-primary placeholder:text-outline/40 focus:ring-2 focus:ring-primary/30 transition-all outline-none" placeholder="observer@nexus.security" type="email" />
              </div>
            </div>
            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-headline font-bold uppercase tracking-widest text-outline ml-1">Security Cipher</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="key_visualizer">key_visualizer</span>
                <input className="w-full bg-surface-container-lowest border-none py-4 pl-12 pr-4 rounded-lg font-mono text-sm text-primary placeholder:text-outline/40 focus:ring-2 focus:ring-primary/30 transition-all outline-none" placeholder="••••••••••••" type="password" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group/toggle">
                <div className="relative w-10 h-5 bg-surface-variant rounded-full transition-colors group-has-[:checked]:bg-tertiary-container">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="absolute top-1 left-1 w-3 h-3 bg-on-surface-variant rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-on-tertiary-container"></div>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">Stay Synchronized</span>
              </label>
              <a className="text-xs font-bold text-outline hover:text-primary transition-colors" href="#">Forgotten Key?</a>
            </div>
            {/* Login Button */}
            <button className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(23,179,170,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(23,179,170,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300" type="button">
              Initiate Connection
            </button>
          </form>
          <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-on-surface-variant text-sm mb-4">New entity in the cosmos?</p>
            <button className="px-6 py-2 rounded-lg border border-outline-variant/20 text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors">
              Create New Vault
            </button>
          </div>
        </div>

        {/* Environmental Decorative Elements */}
        <div className="absolute bottom-12 right-12 text-right hidden xl:block opacity-40">
          <div className="font-mono text-[10px] text-outline leading-tight">
            NODE_LOCATION: ORBITAL_STATION_IV<br />
            ENCRYPTION_LAYER: AES-4096-QUANTUM<br />
            SYSTEM_STATUS: NOMINAL
          </div>
        </div>
        <div className="absolute top-32 left-12 hidden xl:block opacity-20">
          <div className="w-64 h-64 border-[0.5px] border-primary/30 rounded-full flex items-center justify-center">
            <div className="w-48 h-48 border-[0.5px] border-primary/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-32 h-32 border-[0.5px] border-primary/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Badge */}
      <footer className="fixed bottom-0 w-full py-6 px-12 flex justify-between items-center text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-outline/50 z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]" data-icon="verified_user">verified_user</span> ISO 27001</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]" data-icon="security">security</span> END-TO-END</span>
        </div>
        <div>© 2024 SECUREVAULT NEXUS</div>
      </footer>
    </div>
  );
}
