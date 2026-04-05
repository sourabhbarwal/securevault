import React from 'react';

export default function VaultDashboardDense() {
  return (
    <>
      
<div className="aurora-bg"></div>
<div className="fixed inset-0 particle-dots pointer-events-none z-0"></div>

<header className="bg-[#0b0e18]/80 backdrop-blur-lg docked full-width top-0 z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex justify-between items-center px-8 py-4 w-full sticky">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#7EFFF5] text-3xl" data-icon="lock">lock</span>
<span className="text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">SecureVault</span>
</div>
<div className="hidden md:flex items-center gap-8">
<nav className="flex items-center gap-6">
<a className="text-[#7EFFF5] border-b-2 border-[#7EFFF5] pb-1 font-['Space_Grotesk'] font-bold tracking-tight transition-all duration-300" href="#">Vaults</a>
<a className="text-slate-400 font-medium font-['Space_Grotesk'] hover:text-[#7EFFF5] transition-all duration-300" href="#">Audit Log</a>
<a className="text-slate-400 font-medium font-['Space_Grotesk'] hover:text-[#7EFFF5] transition-all duration-300" href="#">Tools</a>
</nav>
<div className="h-8 w-[1px] bg-white/10 mx-2"></div>
<div className="flex items-center gap-4">
<button className="text-slate-400 hover:text-[#7EFFF5] transition-all"><span className="material-symbols-outlined" data-icon="notifications">notifications</span></button>
<button className="text-slate-400 hover:text-[#7EFFF5] transition-all"><span className="material-symbols-outlined" data-icon="settings">settings</span></button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="Cyberpunk style profile avatar of a security professional with glowing blue accents and high-tech visor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkFviRK1ADe_w1HnWY_oSSP-tMgjxfOPw9InvycQ8LlGj4ihlz_oMnte-ePq3XfoPvoRVOedIqJcEWzcFGUPn0EzgfJNkNFuCXvuxDOQvJ77ojXuXzGij6R3sQhHqZP6BGQhEBoM_GEol92b_PgX8yM6Id_dkWUMCge7yKTDoXy2AZ__j7d4GPVKyYw5WIdSmJbhsNiyUymoR8mjNSp7a17ZLctLA_j6GotiP2Fq7Ubonc9NlDAUi7lDrkF_DM-K8RnydtwGYnXIQ" />
</div>
</div>
</div>
</header>
<div className="flex min-h-screen">

<aside className="bg-[#0b0e18]/40 backdrop-blur-2xl fixed left-0 top-[72px] h-[calc(100vh-72px)] w-72 rounded-r-xl border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-40 hidden md:flex flex-col">
<div className="px-8 pt-8 pb-4">
<h2 className="text-[#7EFFF5] text-xl font-bold font-['Space_Grotesk'] tracking-wide">The Observer</h2>
<p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Quantum-Encrypted</p>
</div>
<nav className="flex flex-col gap-2 pt-4">
<div className="px-4 mb-2">
<p className="text-[10px] text-outline uppercase font-bold tracking-[0.2em] px-4 pb-2">Primary Domains</p>
<a className="bg-gradient-to-r from-[#7EFFF5]/10 to-transparent text-[#7EFFF5] border-l-4 border-[#7EFFF5] px-6 py-3 font-bold flex items-center gap-3 group transition-transform duration-300 translate-x-1" href="#">
<span className="material-symbols-outlined" data-icon="enhanced_encryption">enhanced_encryption</span>
<span className="font-['Space_Grotesk'] text-sm tracking-wide">Vaults</span>
</a>
<a className="text-slate-500 px-6 py-3 hover:bg-white/5 hover:text-slate-200 flex items-center gap-3 transition-colors duration-200" href="#">
<span className="material-symbols-outlined" data-icon="terminal">terminal</span>
<span className="font-['Space_Grotesk'] text-sm tracking-wide">Audit Log</span>
</a>
<a className="text-slate-500 px-6 py-3 hover:bg-white/5 hover:text-slate-200 flex items-center gap-3 transition-colors duration-200" href="#">
<span className="material-symbols-outlined" data-icon="shield_lock">shield_lock</span>
<span className="font-['Space_Grotesk'] text-sm tracking-wide">Security Tools</span>
</a>
</div>
<div className="px-4 mt-4">
<p className="text-[10px] text-outline uppercase font-bold tracking-[0.2em] px-4 pb-2">Categories</p>
<a className="text-slate-500 px-6 py-2 hover:text-primary flex items-center gap-3 transition-colors text-sm" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(111,241,231,0.6)]"></span> Personal
                </a>
<a className="text-slate-500 px-6 py-2 hover:text-secondary flex items-center gap-3 transition-colors text-sm" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,102,181,0.6)]"></span> Work Projects
                </a>
<a className="text-slate-500 px-6 py-2 hover:text-tertiary-container flex items-center gap-3 transition-colors text-sm" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-container shadow-[0_0_8px_rgba(198,253,85,0.6)]"></span> Crypto Assets
                </a>
</div>
</nav>
<div className="mt-auto p-8">
<button className="w-full py-3 px-4 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/20">
                Lock All Vaults
            </button>
</div>
</aside>

<main className="flex-1 ml-0 md:ml-72 p-8 md:p-12 relative z-10">
<header className="mb-12 flex justify-between items-end">
<div>
<h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Primary Vault</h1>
<p className="text-on-surface-variant max-w-md text-lg font-light">Managing 24 encrypted secrets across 4 global clusters.</p>
</div>
<div className="flex gap-4">
<div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
<span className="text-primary text-xs font-bold uppercase tracking-widest">Security Score</span>
<div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-primary-container w-[92%]"></div>
</div>
<span className="font-mono text-primary text-sm">92%</span>
</div>
</div>
</header>

<div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
<div className="relative flex-1 w-full">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
<input className="w-full bg-surface-container-lowest border-none ring-1 ring-outline/20 focus:ring-2 focus:ring-primary/40 rounded-xl py-4 pl-12 pr-4 font-mono text-sm placeholder:text-outline/50 text-primary transition-all" placeholder="Search secrets by name, URL, or tag..." type="text" />
</div>
<div className="flex gap-2">
<button className="bg-surface-container-high px-6 py-4 rounded-xl border border-white/5 hover:bg-surface-variant transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span>
<span className="text-sm font-label">Filter</span>
</button>
<button className="bg-surface-container-high px-6 py-4 rounded-xl border border-white/5 hover:bg-surface-variant transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="sort">sort</span>
<span className="text-sm font-label">Sort</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

<div className="vault-card group bg-surface-container-low/40 rounded-2xl p-5 flex flex-col relative">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
<span className="material-symbols-outlined text-primary text-xl" data-icon="cloud">cloud</span>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">Encrypted</span>
<span className="px-2 py-0.5 rounded text-[10px] bg-secondary/10 text-secondary border border-secondary/20 font-bold uppercase tracking-wider">Work</span>
</div>
</div>
<div className="mb-4">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-sm" data-icon="lock">lock</span>
<h3 className="font-headline font-bold text-base text-on-surface truncate">AWS Master Console</h3>
</div>
<p className="text-on-surface-variant text-xs font-body truncate">console.aws.amazon.com/iam/home</p>
</div>
<div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex justify-between items-center">
<p className="text-[10px] text-outline uppercase font-bold">Username</p>
<p className="font-mono text-xs text-on-surface">admin_root_nexus</p>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span></button>
<button className="text-outline hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="open_in_new">open_in_new</span></button>
</div>
<div className="flex items-center gap-1">
<span className="text-on-surface tracking-widest text-[10px]">• • • • • •</span>
<span className="material-symbols-outlined text-outline text-sm cursor-pointer hover:text-primary" data-icon="visibility">visibility</span>
</div>
</div>
</div>
</div>

<div className="vault-card group bg-surface-container-low/40 rounded-2xl p-5 flex flex-col relative">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center border border-tertiary-container/20">
<span className="material-symbols-outlined text-tertiary-container text-xl" data-icon="currency_bitcoin">currency_bitcoin</span>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">Encrypted</span>
<span className="px-2 py-0.5 rounded text-[10px] bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 font-bold uppercase tracking-wider">Crypto</span>
</div>
</div>
<div className="mb-4">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-sm" data-icon="key">key</span>
<h3 className="font-headline font-bold text-base text-on-surface truncate">Ledger Recovery Key</h3>
</div>
<p className="text-on-surface-variant text-xs font-body truncate">Offline Storage Phrase</p>
</div>
<div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex justify-between items-center">
<p className="text-[10px] text-outline uppercase font-bold">Identity</p>
<p className="font-mono text-xs text-on-surface">Vault-7712</p>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span></button>
<button className="text-outline hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span></button>
</div>
<span className="text-tertiary-container text-[10px] font-bold flex items-center gap-1 uppercase">
<span className="material-symbols-outlined text-xs" data-icon="verified_user">verified_user</span> 2FA
                        </span>
</div>
</div>
</div>

<div className="vault-card group bg-surface-container-low/40 rounded-2xl p-5 flex flex-col relative">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
<span className="material-symbols-outlined text-secondary text-xl" data-icon="mail">mail</span>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">Encrypted</span>
<span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">Personal</span>
</div>
</div>
<div className="mb-4">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-sm" data-icon="credit_card">credit_card</span>
<h3 className="font-headline font-bold text-base text-on-surface truncate">ProtonMail Admin</h3>
</div>
<p className="text-on-surface-variant text-xs font-body truncate">mail.proton.me</p>
</div>
<div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex justify-between items-center">
<p className="text-[10px] text-outline uppercase font-bold">Email</p>
<p className="font-mono text-xs text-on-surface">nexus@pm.me</p>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span></button>
</div>
<div className="flex gap-0.5">
<div className="w-3 h-1 rounded bg-primary"></div>
<div className="w-3 h-1 rounded bg-primary"></div>
<div className="w-3 h-1 rounded bg-primary"></div>
<div className="w-3 h-1 rounded bg-primary/20"></div>
</div>
</div>
</div>
</div>

<div className="vault-card group bg-surface-container-low/40 rounded-2xl p-5 flex flex-col relative">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-lg bg-outline/10 flex items-center justify-center border border-outline/20">
<span className="material-symbols-outlined text-outline text-xl" data-icon="database">database</span>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">Encrypted</span>
<span className="px-2 py-0.5 rounded text-[10px] bg-secondary/10 text-secondary border border-secondary/20 font-bold uppercase tracking-wider">Work</span>
</div>
</div>
<div className="mb-4">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-sm" data-icon="description">description</span>
<h3 className="font-headline font-bold text-base text-on-surface truncate">Production DB Key</h3>
</div>
<p className="text-on-surface-variant text-xs font-body truncate">PostgreSQL / Nexus-Cluster-01</p>
</div>
<div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex justify-between items-center">
<p className="text-[10px] text-outline uppercase font-bold">User</p>
<p className="font-mono text-xs text-on-surface">db_admin_svc</p>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span></button>
<button className="text-outline hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="refresh">refresh</span></button>
</div>
<p className="font-mono text-[10px] text-error font-bold italic">14d Exp.</p>
</div>
</div>
</div>

<div className="vault-card group bg-surface-container-low/40 rounded-2xl p-5 flex flex-col relative">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
<span className="material-symbols-outlined text-primary text-xl" data-icon="shield">shield</span>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">Encrypted</span>
<span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">Personal</span>
</div>
</div>
<div className="mb-4">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-sm" data-icon="key">key</span>
<h3 className="font-headline font-bold text-base text-on-surface truncate">Main GitHub SSH</h3>
</div>
<p className="text-on-surface-variant text-xs font-body truncate">github.com/nexus-core</p>
</div>
<div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex justify-between items-center">
<p className="text-[10px] text-outline uppercase font-bold">Identity</p>
<p className="font-mono text-xs text-on-surface">ed25519-node-01</p>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span></button>
</div>
<span className="text-primary text-[10px] font-bold flex items-center gap-1 uppercase">
<span className="material-symbols-outlined text-xs" data-icon="verified">verified</span> SECURE
                        </span>
</div>
</div>
</div>

<div className="vault-card group bg-surface-container-low/40 rounded-2xl p-5 flex flex-col relative">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
<span className="material-symbols-outlined text-secondary text-xl" data-icon="credit_card">credit_card</span>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">Encrypted</span>
<span className="px-2 py-0.5 rounded text-[10px] bg-secondary/10 text-secondary border border-secondary/20 font-bold uppercase tracking-wider">Work</span>
</div>
</div>
<div className="mb-4">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-sm" data-icon="lock">lock</span>
<h3 className="font-headline font-bold text-base text-on-surface truncate">Stripe Production</h3>
</div>
<p className="text-on-surface-variant text-xs font-body truncate">dashboard.stripe.com</p>
</div>
<div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex justify-between items-center">
<p className="text-[10px] text-outline uppercase font-bold">Token</p>
<p className="font-mono text-xs text-on-surface">sk_prod_...9a2e</p>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span></button>
</div>
<div className="flex items-center gap-1">
<span className="text-on-surface tracking-widest text-[10px]">• • • • • •</span>
<span className="material-symbols-outlined text-outline text-sm cursor-pointer hover:text-primary" data-icon="visibility">visibility</span>
</div>
</div>
</div>
</div>
</div>

<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-surface-container-low/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
<p className="text-outline text-xs uppercase font-bold tracking-widest mb-4">Network Activity</p>
<div className="flex items-end gap-1 h-12 mb-4">
<div className="w-2 bg-primary/40 h-[40%] rounded-t-sm"></div>
<div className="w-2 bg-primary/60 h-[70%] rounded-t-sm"></div>
<div className="w-2 bg-primary h-[50%] rounded-t-sm"></div>
<div className="w-2 bg-primary/80 h-[90%] rounded-t-sm"></div>
<div className="w-2 bg-primary h-[30%] rounded-t-sm"></div>
<div className="w-2 bg-primary/60 h-[60%] rounded-t-sm"></div>
</div>
<p className="text-2xl font-headline font-bold text-on-surface">Secure Sync</p>
<p className="text-outline text-sm">Last update: 2m ago</p>
</div>
<div className="bg-surface-container-low/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
<p className="text-outline text-xs uppercase font-bold tracking-widest mb-4">Threat Detection</p>
<div className="flex items-center gap-4 mb-4">
<span className="material-symbols-outlined text-secondary text-4xl" data-icon="verified">verified</span>
<span className="text-3xl font-headline font-bold text-on-surface">Clean</span>
</div>
<p className="text-on-surface-variant text-sm">0 Intrusions detected in 30 days.</p>
</div>
<div className="bg-surface-container-low/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/5 rounded-full blur-2xl group-hover:bg-tertiary-container/10 transition-colors"></div>
<p className="text-outline text-xs uppercase font-bold tracking-widest mb-4">Global Nodes</p>
<div className="flex items-center gap-4 mb-4">
<span className="material-symbols-outlined text-tertiary-container text-4xl" data-icon="public">public</span>
<span className="text-3xl font-headline font-bold text-on-surface">12/12</span>
</div>
<p className="text-on-surface-variant text-sm">Active clusters in Tokyo, London, NYC.</p>
</div>
</div>
</main>
</div>

<button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] text-[#002826] shadow-[0_10px_40px_rgba(111,241,231,0.4)] flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-50 border border-white/20">
<span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-90" data-icon="add">add</span>
</button>

<div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0b0e18]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
<button className="flex flex-col items-center gap-1 text-[#7EFFF5]">
<span className="material-symbols-outlined" data-icon="enhanced_encryption">enhanced_encryption</span>
<span className="text-[10px] font-bold uppercase tracking-widest">Vaults</span>
</button>
<button className="flex flex-col items-center gap-1 text-outline">
<span className="material-symbols-outlined" data-icon="terminal">terminal</span>
<span className="text-[10px] font-bold uppercase tracking-widest">Log</span>
</button>
<button className="flex flex-col items-center gap-1 text-outline">
<span className="material-symbols-outlined" data-icon="shield_lock">shield_lock</span>
<span className="text-[10px] font-bold uppercase tracking-widest">Tools</span>
</button>
<button className="flex flex-col items-center gap-1 text-outline">
<span className="material-symbols-outlined" data-icon="settings_suggest">settings_suggest</span>
<span className="text-[10px] font-bold uppercase tracking-widest">Prefs</span>
</button>
</div>

    </>
  );
}
