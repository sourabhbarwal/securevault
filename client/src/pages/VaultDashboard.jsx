import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate }                        from 'react-router-dom';
import { motion, AnimatePresence }           from 'framer-motion';
import toast                                 from 'react-hot-toast';
import { useAuth }                           from '../context/AuthContext';
import axios                                 from '../api/axiosInstance';
import { encryptSecret, decryptSecret }      from '../utils/encryption';

export default function VaultDashboard() {
      // ── Auth + State ──────────────────────────────────────────
    const { aesKey, logout } = useAuth();
    const navigate = useNavigate();

    const [secrets,  setSecrets]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [search,   setSearch]   = useState('');
    const [category, setCategory] = useState('all');
    const [showAdd,  setShowAdd]  = useState(false);
    const [revealed, setRevealed] = useState(null);

    // ── Fetch secret metadata from server ─────────────────────
    // NOTE: list endpoint returns metadata only (no encrypted blobs)
    const fetchSecrets = useCallback(async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'all') params.category = category;
        if (search.trim())      params.search   = search.trim();

        const { data } = await axios.get('/vault', { params });
        setSecrets(data.data.secrets || []);
      } catch {
        toast.error('Failed to load vault');
      } finally {
        setLoading(false);
      }
    }, [category, search]);

    // Fetch on mount and whenever filters change
    useEffect(() => {
      fetchSecrets();
    }, [fetchSecrets]);

    // Client-side filter for instant UI feedback while typing
    const filteredSecrets = secrets.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchCat    = category === 'all' || s.category === category;
      return matchSearch && matchCat;
    });

    // ── REVEAL a secret ───────────────────────────────────────
    // Fetches the full encrypted blob and decrypts it in the browser
    const handleReveal = async (secret) => {
      if (!aesKey) {
        toast.error('Session expired — log in again to decrypt secrets');
        return;
      }
      try {
        const { data } = await axios.get(`/vault/${secret._id}`);
        const full     = data.data.secret;

        const plain = await decryptSecret(
          {
            encryptedData: full.encryptedData,
            iv:            full.iv,
            authTag:       full.authTag,
          },
          aesKey
        );

        setRevealed({ meta: secret, data: plain });
      } catch (err) {
        if (err.name === 'OperationError') {
          // Web Crypto API throws OperationError when decryption fails
          toast.error('Decryption failed — log in again to restore your key');
        } else {
          toast.error('Failed to load secret');
        }
        console.error('Reveal error:', err);
      }
    };

    // ── CREATE a new secret ───────────────────────────────────
    // Encrypts in browser first, then sends ciphertext to server
    const handleCreateSecret = async (formData) => {
      if (!aesKey) {
        toast.error('Log in again to create secrets');
        return false;
      }
      try {
        // Build plaintext object to encrypt
        const plain = {
          username: formData.username || '',
          password: formData.password || '',
          url:      formData.url      || '',
          notes:    formData.notes    || '',
        };

        // AES-256-GCM encrypt ENTIRELY in browser
        const { encryptedData, iv, authTag } = await encryptSecret(plain, aesKey);

        // Server receives only encrypted blob — cannot read contents
        await axios.post('/vault', {
          name:     formData.name,
          category: formData.category || 'login',
          encryptedData,
          iv,
          authTag,
        });

        toast.success('Secret encrypted and stored!');
        fetchSecrets();
        return true;

      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create secret');
        return false;
      }
    };

    // ── DELETE a secret ───────────────────────────────────────
    const handleDelete = async (id, name) => {
      if (!window.confirm(`Permanently delete "${name}"?\nThis cannot be undone.`)) return;
      try {
        await axios.delete(`/vault/${id}`);
        setSecrets((prev) => prev.filter((s) => s._id !== id));
        toast.success('Secret deleted');
      } catch {
        toast.error('Delete failed');
      }
    };

    // ── TOGGLE favourite ──────────────────────────────────────
    const handleToggleFav = async (secret) => {
      try {
        await axios.put(`/vault/${secret._id}`, { isFavorite: !secret.isFavorite });
        setSecrets((prev) =>
          prev.map((s) =>
            s._id === secret._id ? { ...s, isFavorite: !s.isFavorite } : s
          )
        );
      } catch {
        toast.error('Update failed');
      }
    };
    
  return (
    <div className="font-body selection:bg-primary/30">
      <div className="aurora-bg"></div>
      <div className="fixed inset-0 particle-dots pointer-events-none z-0"></div>
      {/* TopAppBar */}
      <header className="bg-[#0b0e18]/80 backdrop-blur-lg docked full-width top-0 z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex justify-between items-center px-8 py-4 w-full sticky">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7EFFF5] text-3xl" data-icon="lock">lock</span>
          <span className="text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">SecureVault</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <a className="text-[#7EFFF5] border-b-2 border-[#7EFFF5] pb-1 font-['Space_Grotesk'] font-bold tracking-tight transition-all duration-300" href="/vault">Vaults</a>
            <a className="text-slate-400 font-medium font-['Space_Grotesk'] hover:text-[#7EFFF5] transition-all duration-300" href="#">Audit Log</a>
          </nav>
          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-[#7EFFF5] transition-all"><span className="material-symbols-outlined" data-icon="notifications">notifications</span></button>
            <button onClick={() => navigate('/settings')} className="text-slate-400 hover:text-[#7EFFF5] transition-all"><span className="material-symbols-outlined" data-icon="settings">settings</span></button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkFviRK1ADe_w1HnWY_oSSP-tMgjxfOPw9InvycQ8LlGj4ihlz_oMnte-ePq3XfoPvoRVOedIqJcEWzcFGUPn0EzgfJNkNFuCXvuxDOQvJ77ojXuXzGij6R3sQhHqZP6BGQhEBoM_GEol92b_PgX8yM6Id_dkWUMCge7yKTDoXy2AZ__j7d4GPVKyYw5WIdSmJbhsNiyUymoR8mjNSp7a17ZLctLA_j6GotiP2Fq7Ubonc9NlDAUi7lDrkF_DM-K8RnydtwGYnXIQ" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* SideNavBar */}
        <aside className="bg-[#0b0e18]/40 backdrop-blur-2xl fixed left-0 top-[64px] h-[calc(100vh-72px)] w-72 rounded-r-xl border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-40 hidden md:flex flex-col">
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-[#7EFFF5] text-xl font-bold font-['Space_Grotesk'] tracking-wide">The Observer</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Quantum-Encrypted</p>
          </div>
          <nav className="flex flex-col gap-2 pt-4">
            <div className="px-4 mb-2">
              <p className="text-[10px] text-outline uppercase font-bold tracking-[0.2em] px-4 pb-2">Primary Domains</p>
              <a className="bg-gradient-to-r from-[#7EFFF5]/10 to-transparent text-[#7EFFF5] border-l-4 border-[#7EFFF5] px-6 py-3 font-bold flex items-center gap-3 group transition-transform duration-300 translate-x-1" href="#" onClick={(e) => { e.preventDefault(); setCategory('all'); }} style={{ background: category === 'all' ? 'var(--primary-dim, rgba(126,255,245,0.12))' : '' }}>
                <span className="material-symbols-outlined" data-icon="enhanced_encryption">enhanced_encryption</span>
                <span className="font-['Space_Grotesk'] text-sm tracking-wide">Vaults (All)</span>
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
              <a className="text-slate-500 px-6 py-2 hover:text-primary flex items-center gap-3 transition-colors text-sm" href="#" onClick={(e) => { e.preventDefault(); setCategory('personal'); }} style={{ background: category === 'personal' ? 'var(--primary-dim, rgba(126,255,245,0.12))' : 'transparent' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(111,241,231,0.6)]"></span> Personal
              </a>
              <a className="text-slate-500 px-6 py-2 hover:text-secondary flex items-center gap-3 transition-colors text-sm" href="#" onClick={(e) => { e.preventDefault(); setCategory('work'); }} style={{ background: category === 'work' ? 'var(--primary-dim, rgba(126,255,245,0.12))' : 'transparent' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,102,181,0.6)]"></span> Work Projects
              </a>
              <a className="text-slate-500 px-6 py-2 hover:text-tertiary-container flex items-center gap-3 transition-colors text-sm" href="#" onClick={(e) => { e.preventDefault(); setCategory('crypto'); }} style={{ background: category === 'crypto' ? 'var(--primary-dim, rgba(126,255,245,0.12))' : 'transparent' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container shadow-[0_0_8px_rgba(198,253,85,0.6)]"></span> Crypto Assets
              </a>
            </div>
          </nav>
          <div className="mt-auto p-8">
            <button
              onClick={logout}
              className="w-full py-3 px-4 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/20"
            >
              Lock All Vaults
            </button>
          </div>
        </aside>
        {/* Main Content Area */}
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
          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
              <input className="w-full bg-surface-container-lowest border-none ring-1 ring-outline/20 focus:ring-2 focus:ring-primary/40 rounded-xl py-4 pl-12 pr-4 font-mono text-sm placeholder:text-outline/50 text-primary transition-all" placeholder="Search secrets by name, URL, or tag..." type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          {/* Shimmer keyframe — injected once here */}
          <style>{`
            @keyframes shimmer {
              0%   { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>
          
          {/* Secrets Detailed List */}
          <div className="flex flex-col gap-4">
            {loading ? (
              // ── Skeleton shimmer while vault loads ───────────────
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '86px',
                    borderRadius: '16px',
                    background:
                      'linear-gradient(90deg, rgba(12,20,40,0.6) 25%, rgba(30,45,77,0.4) 50%, rgba(12,20,40,0.6) 75%)',
                    backgroundSize: '200% auto',
                    animation: `shimmer 1.4s ease-in-out ${i * 0.12}s infinite`,
                    border: '1px solid rgba(126,255,245,0.06)',
                  }}
                />
              ))
            ) : filteredSecrets.length === 0 ? (
              // ── Empty state — context-aware message ──────────────
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="material-symbols-outlined text-outline/30 text-6xl" data-icon="enhanced_encryption">enhanced_encryption</span>
                <div className="text-center">
                  <p className="font-headline font-semibold text-on-surface-variant text-lg mb-1">
                    {search ? 'No secrets match your search' : 'Your vault is empty'}
                  </p>
                  <p className="text-outline text-sm">
                    {search ? 'Try different keywords or clear the filter' : 'Click the + button below to add your first secret'}
                  </p>
                </div>
              </div>
            ) : (
              // ── Real secrets ──────────────────────────────────────
              filteredSecrets.map((secret) => {
                const catStyles = {
                  login:   { icon: 'vpn_key',         color: 'text-primary',            bg: 'bg-primary/10',            border: 'border-primary/20',            badge: 'bg-primary/10 text-primary border-primary/20' },
                  work:    { icon: 'cloud',            color: 'text-secondary',          bg: 'bg-secondary/10',          border: 'border-secondary/20',          badge: 'bg-secondary/10 text-secondary border-secondary/20' },
                  personal:{ icon: 'mail',             color: 'text-primary',            bg: 'bg-primary/10',            border: 'border-primary/20',            badge: 'bg-primary/10 text-primary border-primary/20' },
                  crypto:  { icon: 'currency_bitcoin', color: 'text-tertiary-container', bg: 'bg-tertiary-container/10', border: 'border-tertiary-container/20', badge: 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' },
                  card:    { icon: 'credit_card',      color: 'text-secondary',          bg: 'bg-secondary/10',          border: 'border-secondary/20',          badge: 'bg-secondary/10 text-secondary border-secondary/20' },
                  note:    { icon: 'sticky_note_2',    color: 'text-outline',            bg: 'bg-outline/10',            border: 'border-outline/20',            badge: 'bg-outline/10 text-outline border-outline/20' },
                  api_key: { icon: 'key',              color: 'text-tertiary-container', bg: 'bg-tertiary-container/10', border: 'border-tertiary-container/20', badge: 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' },
                };
                const s = catStyles[secret.category] || catStyles.login;
                return (
                  <div
                    key={secret._id}
                    onClick={() => handleReveal(secret)}
                    className="glass-row group bg-surface-container-low/40 rounded-2xl border border-white/5 p-5 flex items-center gap-6 cursor-pointer hover:border-primary/20 hover:bg-surface-container-low/70 transition-all duration-200"
                  >
                    {/* Category icon */}
                    <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center border ${s.border} shrink-0`}>
                      <span className={`material-symbols-outlined ${s.color} text-2xl`} data-icon={s.icon}>{s.icon}</span>
                    </div>

                    {/* Name + category badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-headline font-bold text-lg text-on-surface truncate">{secret.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase tracking-wider shrink-0 ${s.badge}`}>{secret.category || 'misc'}</span>
                        {secret.isFavorite && (
                          <span className="material-symbols-outlined text-yellow-400 text-sm" data-icon="star">star</span>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-sm font-body">
                        {secret.lastAccessedAt
                          ? `Last accessed ${new Date(secret.lastAccessedAt).toLocaleDateString()}`
                          : 'Click to decrypt & reveal'}
                      </p>
                    </div>

                    {/* Last updated */}
                    <div className="hidden lg:block w-40">
                      <p className="text-[10px] text-outline uppercase font-bold mb-1">Updated</p>
                      <p className="font-mono text-sm text-on-surface">{new Date(secret.updatedAt || secret.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Status */}
                    <div className="hidden lg:block w-32">
                      <p className="text-[10px] text-outline uppercase font-bold mb-1">Status</p>
                      <p className="text-primary text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" data-icon="lock">lock</span> Encrypted
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleFav(secret); }}
                        className={`w-10 h-10 rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center ${secret.isFavorite ? 'text-yellow-400' : 'text-outline hover:text-primary'}`}
                        title={secret.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <span className="material-symbols-outlined" data-icon={secret.isFavorite ? 'star' : 'star_outline'}>{secret.isFavorite ? 'star' : 'star_outline'}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(secret._id, secret.name); }}
                        className="w-10 h-10 rounded-lg hover:bg-error/10 hover:text-error transition-colors flex items-center justify-center text-outline"
                        title="Delete secret"
                      >
                        <span className="material-symbols-outlined" data-icon="delete">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Summary Stats (Bento style at bottom) */}
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
      {/* Floating Action Button */}
      <button onClick={() => setShowAdd(true)} className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] text-[#002826] shadow-[0_10px_40px_rgba(111,241,231,0.4)] flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-50 border border-white/20" title="Add new secret">
        <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-90" data-icon="add">add</span>
      </button>
      {/* Mobile Navigation (BottomNavBar) */}
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

      {/* ── Modals ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showAdd && (
          <AddSecretModal
            onClose={() => setShowAdd(false)}
            onSubmit={handleCreateSecret}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealed && (
          <RevealModal
            secret={revealed}
            onClose={() => setRevealed(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddSecretModal
// ─────────────────────────────────────────────────────────────────────────────
function AddSecretModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', category: 'login',
    username: '', password: '', url: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPw,     setShowPw]     = useState(false);

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSubmitting(true);
    const ok = await onSubmit(form);
    if (ok) onClose();
    else setSubmitting(false);
  };

  const inputStyle = {
    width: '100%', padding: '11px 13px',
    background: 'rgba(8,13,30,0.9)',
    border: '1px solid rgba(126,255,245,0.1)',
    borderRadius: '10px', color: '#E8EDF8',
    fontFamily: 'inherit', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.15s', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    color: '#7A8AAD', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: '6px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(4,6,15,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px',
      }}
    >
      {/* spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ ease: [0.34, 1.56, 0.64, 1], duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0C1428',
          border: '1px solid rgba(126,255,245,0.13)',
          borderRadius: '24px', padding: '40px',
          maxWidth: '500px', width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.75)',
          maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        <h2 style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '22px', fontWeight: 800, marginBottom: '28px',
          color: '#E8EDF8',
        }}>
          Add New Secret
        </h2>

        {/* Category */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={set('category')} style={inputStyle}>
            <option value="login">Login</option>
            <option value="card">Card</option>
            <option value="note">Note</option>
            <option value="api_key">API Key</option>
          </select>
        </div>

        {/* Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Name *</label>
          <input
            value={form.name} onChange={set('name')}
            placeholder="Gmail, AWS, GitHub..."
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'rgba(126,255,245,0.4)'}
            onBlur={(e)  => e.target.style.borderColor = 'rgba(126,255,245,0.1)'}
          />
        </div>

        {/* Username */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Username / Email</label>
          <input
            value={form.username} onChange={set('username')}
            placeholder="user@example.com"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'rgba(126,255,245,0.4)'}
            onBlur={(e)  => e.target.style.borderColor = 'rgba(126,255,245,0.1)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <label style={labelStyle}>Password</label>
          <input
            type={showPw ? 'text' : 'password'}
            value={form.password} onChange={set('password')}
            placeholder="••••••••"
            style={{ ...inputStyle, paddingRight: '72px' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(126,255,245,0.4)'}
            onBlur={(e)  => e.target.style.borderColor = 'rgba(126,255,245,0.1)'}
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            style={{
              position: 'absolute', right: '12px',
              top: '50%', transform: 'translateY(calc(-50% + 10px))',
              background: 'none', border: 'none',
              color: '#7A8AAD', cursor: 'pointer', fontSize: '12px',
            }}
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* URL */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>URL (optional)</label>
          <input
            type="url" value={form.url} onChange={set('url')}
            placeholder="https://example.com"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'rgba(126,255,245,0.4)'}
            onBlur={(e)  => e.target.style.borderColor = 'rgba(126,255,245,0.1)'}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            value={form.notes} onChange={set('notes')}
            placeholder="Any additional info..."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(126,255,245,0.4)'}
            onBlur={(e)  => e.target.style.borderColor = 'rgba(126,255,245,0.1)'}
          />
        </div>

        {/* Encryption indicator */}
        <p style={{
          fontSize: '11px', color: '#3D4F70',
          marginBottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          🔒 Encrypted with AES-256-GCM before leaving your browser
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: 'transparent',
              border: '1px solid rgba(126,255,245,0.1)',
              color: '#7A8AAD', cursor: 'pointer',
              fontSize: '14px', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(126,255,245,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(126,255,245,0.1)'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: submitting
                ? 'rgba(126,255,245,0.15)'
                : 'linear-gradient(135deg, #7EFFF5, #4DD9CC)',
              border: 'none',
              color: submitting ? '#7A8AAD' : '#04060F',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {submitting ? (
              <span style={{
                width: 16, height: 16,
                border: '2px solid #7A8AAD',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.6s linear infinite',
              }} />
            ) : '🔐 Encrypt & Save'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RevealModal
// ─────────────────────────────────────────────────────────────────────────────
function RevealModal({ secret, onClose }) {
  const copy = (value, label) => {
    navigator.clipboard.writeText(value)
      .then(()  => toast.success(`${label} copied to clipboard!`))
      .catch(()  => toast.error('Copy failed'));
  };

  const fieldLabel = {
    username: 'Username / Email',
    password: 'Password',
    url:      'URL',
    notes:    'Notes',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(4,6,15,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ ease: [0.34, 1.56, 0.64, 1], duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0C1428',
          border: '1px solid rgba(126,255,245,0.13)',
          borderRadius: '24px', padding: '40px',
          maxWidth: '480px', width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.75)',
          maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: '28px',
        }}>
          <div>
            <h2 style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '22px', fontWeight: 800,
              color: '#E8EDF8', marginBottom: '4px',
            }}>
              {secret.meta.name}
            </h2>
            <span style={{
              fontSize: '11px', color: '#7A8AAD',
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {secret.meta.category}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: '#7A8AAD', cursor: 'pointer',
              fontSize: '26px', lineHeight: 1, padding: '0 4px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E8EDF8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#7A8AAD'}
          >
            ×
          </button>
        </div>

        {/* Fields */}
        {Object.entries(secret.data)
          .filter(([, v]) => v && String(v).trim())
          .map(([key, value]) => (
            <div key={key} style={{ marginBottom: '18px' }}>
              <p style={{
                fontSize: '11px', color: '#7A8AAD',
                fontFamily: '"JetBrains Mono", monospace',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                {fieldLabel[key] || key}
              </p>
              <div
                onClick={() => copy(value, fieldLabel[key] || key)}
                title="Click to copy"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '14px', color: '#7EFFF5',
                  background: 'rgba(126,255,245,0.06)',
                  padding: '12px 16px', borderRadius: '10px',
                  border: '1px solid rgba(126,255,245,0.1)',
                  cursor: 'pointer', wordBreak: 'break-all',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '12px',
                  transition: 'background 0.15s',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.background = 'rgba(126,255,245,0.13)'
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.background = 'rgba(126,255,245,0.06)'
                }
              >
                <span>
                  {key === 'password'
                    ? '•'.repeat(Math.min(String(value).length, 28))
                    : value
                  }
                </span>
                <span style={{ fontSize: '10px', color: '#3D4F70', whiteSpace: 'nowrap' }}>
                  click to copy
                </span>
              </div>
            </div>
          ))}

        <p style={{
          fontSize: '11px', color: '#3D4F70',
          textAlign: 'center', marginTop: '8px',
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          🔒 Decrypted locally — never sent to server
        </p>
      </motion.div>
    </motion.div>
  );
}
