import React from 'react';

export default function SettingsPage() {
  return (
    <div className="font-body selection:bg-primary/30 min-h-screen">
      <div className="aurora-blur">
        <div className="particle" style={{ top: '15%', left: '25%' }}></div>
        <div className="particle" style={{ top: '45%', left: '85%' }}></div>
        <div className="particle" style={{ top: '75%', left: '15%' }}></div>
        <div className="particle" style={{ top: '25%', left: '65%' }}></div>
        <div className="particle" style={{ top: '85%', left: '45%' }}></div>
      </div>
      {/* TopAppBar */}
      <header className="bg-[#0b0e18]/80 backdrop-blur-lg border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] docked full-width top-0 z-50 flex justify-between items-center px-8 py-4 w-full sticky">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7EFFF5]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <span className="text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">SecureVault</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <a className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300 font-['Space_Grotesk']" href="#">Vaults</a>
            <a className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300 font-['Space_Grotesk']" href="#">Audit Log</a>
            <a className="text-[#7EFFF5] border-b-2 border-[#7EFFF5] pb-1 font-bold font-['Space_Grotesk']" href="#">Preferences</a>
          </nav>
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-[#7EFFF5] transition-colors">notifications</span>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-[#7EFFF5] transition-colors">settings</span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG9_CFbdqUFSfosY0nAAQq8gDMIjwaBoYp-dhnxjtMHJvbffXiJDYwF7YW5vyxpiFFiedshON_FcWY9RCLL2fyWl7nZITbqwsiS8QCkd6_r0BZpdd6suDtomgU_U-SYxPtSHYENtpQFYoa-Sayw6aW9POu7chIXmTRS2clVNQvWporBi3n_48ThQLiAK2HP6nwq9mGQeTGWUSpnKlLAgVo5TWsJdwFG9nfK77VypZByJUqm8ZU67U5P9R0vfOgg6WWlPAL7bIg09Y" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* SideNavBar */}
        <aside className="bg-[#0b0e18]/40 backdrop-blur-2xl border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)] fixed left-0 top-[72px] h-[calc(100vh-72px)] w-72 rounded-r-xl z-40 hidden lg:flex flex-col gap-2 pt-8">
          <div className="px-8 mb-8">
            <h2 className="text-[#7EFFF5] text-xl font-bold font-['Space_Grotesk']">The Observer</h2>
            <p className="text-slate-500 text-xs tracking-[0.2em] uppercase font-bold">Quantum-Encrypted</p>
          </div>
          <nav className="flex flex-col gap-1">
            <a className="text-slate-500 px-6 py-3 hover:bg-white/5 hover:text-slate-200 transition-colors duration-200 flex items-center gap-4 font-['Space_Grotesk'] text-sm tracking-wide group" href="#">
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">enhanced_encryption</span>
              <span>Vaults</span>
            </a>
            <a className="text-slate-500 px-6 py-3 hover:bg-white/5 hover:text-slate-200 transition-colors duration-200 flex items-center gap-4 font-['Space_Grotesk'] text-sm tracking-wide group" href="#">
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">terminal</span>
              <span>Audit Log</span>
            </a>
            <a className="text-slate-500 px-6 py-3 hover:bg-white/5 hover:text-slate-200 transition-colors duration-200 flex items-center gap-4 font-['Space_Grotesk'] text-sm tracking-wide group" href="#">
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">shield_lock</span>
              <span>Security Tools</span>
            </a>
            <a className="text-slate-500 px-6 py-3 hover:bg-white/5 hover:text-slate-200 transition-colors duration-200 flex items-center gap-4 font-['Space_Grotesk'] text-sm tracking-wide group" href="#">
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">group_work</span>
              <span>Shared Items</span>
            </a>
            <a className="bg-gradient-to-r from-[#7EFFF5]/10 to-transparent text-[#7EFFF5] border-l-4 border-[#7EFFF5] px-6 py-3 font-bold flex items-center gap-4 font-['Space_Grotesk'] text-sm tracking-wide" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings_suggest</span>
              <span>Preferences</span>
            </a>
          </nav>
          <div className="mt-auto p-6">
            <button className="w-full py-3 bg-secondary-container text-on-secondary-container font-black text-xs uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition-all">
              Lock All Vaults
            </button>
          </div>
        </aside>
        {/* Main Canvas */}
        <main className="flex-1 lg:ml-72 p-8 md:p-12 max-w-7xl">
          <header className="mb-12">
            <h1 className="text-5xl font-black font-headline tracking-tighter mb-4">Security Preferences</h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">Configure your quantum-level defense parameters. All changes are propagated through the neural encrypted mesh instantly.</p>
          </header>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* 2FA Control Panel */}
            <section className="md:col-span-4 glass-card p-8 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-tertiary-fixed text-3xl">vibration</span>
                  <h3 className="font-headline font-bold text-xl uppercase tracking-wider">Multi-Factor</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-8">Hardware-backed authentication using biometric keys and TOTP synchronization.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-white/5">
                  <span className="text-sm font-medium">Authenticator App</span>
                  <div className="w-12 h-6 bg-tertiary-container rounded-full relative flex items-center px-1 shadow-[0_0_10px_rgba(198,253,85,0.3)]">
                    <div className="w-4 h-4 bg-on-tertiary-container rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-white/5">
                  <span className="text-sm font-medium">YubiKey Support</span>
                  <div className="w-12 h-6 bg-surface-variant rounded-full relative flex items-center px-1">
                    <div className="w-4 h-4 bg-outline rounded-full"></div>
                  </div>
                </div>
              </div>
            </section>
            {/* API Key Management */}
            <section className="md:col-span-8 glass-card p-8 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">api</span>
                  <h3 className="font-headline font-bold text-xl uppercase tracking-wider">Neural API Nodes</h3>
                </div>
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-black text-xs uppercase px-6 py-2 rounded-md hover:shadow-[0_0_15px_rgba(111,241,231,0.4)] transition-all">
                  Generate Node
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                      <th className="pb-2 pl-4">Node Name</th>
                      <th className="pb-2">Encrypted Secret</th>
                      <th className="pb-2">Access Level</th>
                      <th className="pb-2 text-right pr-4">Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-surface-container-lowest group hover:bg-surface-container-low transition-colors rounded-xl">
                      <td className="py-4 pl-4 rounded-l-xl font-bold text-primary">Production_Main</td>
                      <td className="py-4 font-mono text-xs opacity-60">sv_live_72kX92m...P8z1</td>
                      <td className="py-4"><span className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded border border-primary/20">Read/Write</span></td>
                      <td className="py-4 text-right pr-4 rounded-r-xl">
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-error transition-colors">delete</span>
                      </td>
                    </tr>
                    <tr className="bg-surface-container-lowest group hover:bg-surface-container-low transition-colors">
                      <td className="py-4 pl-4 rounded-l-xl font-bold text-primary">Observer_Analytics</td>
                      <td className="py-4 font-mono text-xs opacity-60">sv_live_44nP11q...R2a5</td>
                      <td className="py-4"><span className="px-2 py-1 bg-outline-variant/30 text-outline text-[10px] rounded border border-outline-variant">Read Only</span></td>
                      <td className="py-4 text-right pr-4 rounded-r-xl">
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-error transition-colors">delete</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            {/* Audit Log Terminal */}
            <section className="md:col-span-12 glass-card p-8 rounded-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-secondary text-3xl">history_edu</span>
                <h3 className="font-headline font-bold text-xl uppercase tracking-wider">Recent Telemetry</h3>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg font-mono text-sm leading-loose border border-white/5 max-h-80 overflow-y-auto custom-scrollbar">
                <div className="flex gap-4 border-l-2 border-primary pl-4 mb-2 hover:bg-primary/5 transition-colors py-1 group">
                  <span className="text-outline shrink-0">14:22:09</span>
                  <span className="text-primary-dim">[SUCCESS]</span>
                  <span className="text-on-surface">Vault "Project-Alpha" accessed by Node:Production_Main. IP: 192.168.1.42</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary-dim text-xs">VERIFIED</span>
                </div>
                <div className="flex gap-4 border-l-2 border-error pl-4 mb-2 hover:bg-error/5 transition-colors py-1 group">
                  <span className="text-outline shrink-0">13:58:12</span>
                  <span className="text-error">[DENIED]</span>
                  <span className="text-on-surface">Invalid 2FA challenge response from unauthorized device: Nexus-7.</span>
                  <span class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-error text-xs">FLAGGED</span>
                </div>
                <div className="flex gap-4 border-l-2 border-secondary pl-4 mb-2 hover:bg-secondary/5 transition-colors py-1 group">
                  <span className="text-outline shrink-0">11:04:45</span>
                  <span className="text-secondary">[UPDATE]</span>
                  <span className="text-on-surface">System Preferences changed: Multi-Factor Authentication strategy adjusted.</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-secondary text-xs">COMMITTED</span>
                </div>
                <div className="flex gap-4 border-l-2 border-primary pl-4 mb-2 hover:bg-primary/5 transition-colors py-1 group">
                  <span className="text-outline shrink-0">09:15:33</span>
                  <span className="text-primary-dim">[SUCCESS]</span>
                  <span className="text-on-surface">Database encryption keys rotated successfully. Quantum-safe entropy confirmed.</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary-dim text-xs">VERIFIED</span>
                </div>
                <div className="flex gap-4 border-l-2 border-outline pl-4 mb-2 hover:bg-white/5 transition-colors py-1 group">
                  <span className="text-outline shrink-0">08:00:01</span>
                  <span className="text-outline">[SYSTEM]</span>
                  <span className="text-on-surface">Daily security posture scan completed. 0 vulnerabilities detected.</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-outline text-xs">IDLE</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 glass-card p-3 rounded-full shadow-2xl border border-primary/20">
        <button className="w-12 h-12 flex items-center justify-center text-primary-dim hover:text-primary transition-colors">
          <span className="material-symbols-outlined">enhanced_encryption</span>
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-primary-dim hover:text-primary transition-colors">
          <span className="material-symbols-outlined">terminal</span>
        </button>
        <button className="w-12 h-12 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(111,241,231,0.5)]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings_suggest</span>
        </button>
      </div>
    </div>
  );
}
