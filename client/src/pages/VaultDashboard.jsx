import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }           from 'framer-motion';
import toast                                 from 'react-hot-toast';
import { useAuth }                           from '../context/AuthContext';
import axios                                 from '../api/axiosInstance';
import { encryptSecret, decryptSecret }      from '../utils/encryption';

export default function VaultDashboard() {
  const { aesKey, logout } = useAuth();

  const [secrets,    setSecrets]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('all');
  const [showAdd,    setShowAdd]    = useState(false);
  const [revealed,   setRevealed]   = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [confirmDel, setConfirmDel] = useState(null); // secret._id pending delete


  // ── Fetch secrets ──────────────────────────────────────────
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

  useEffect(() => { fetchSecrets(); }, [fetchSecrets]);

  // ── Fetch 3 most-recent audit events for the stats strip ──
  useEffect(() => {
    axios.get('/audit', { params: { limit: 3 } })
      .then(({ data }) => setRecentLogs(data.data.logs || []))
      .catch(() => {/* non-fatal */});
  }, []);

  // ── Client-side filter ─────────────────────────────────────
  const filteredSecrets = secrets.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'all' || s.category === category;
    return matchSearch && matchCat;
  });

  // ── Real stats for bottom bento ────────────────────────────
  const totalSecrets   = secrets.length;
  const favoriteCount  = secrets.filter((s) => s.isFavorite).length;
  const categoryCount  = secrets.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  // ── REVEAL ─────────────────────────────────────────────────
  const handleReveal = async (secret) => {
    if (!aesKey) { toast.error('Session expired — log in again'); return; }
    try {
      const { data } = await axios.get(`/vault/${secret._id}`);
      const full     = data.data.secret;
      const plain    = await decryptSecret(
        { encryptedData: full.encryptedData, iv: full.iv, authTag: full.authTag },
        aesKey
      );
      setRevealed({ meta: secret, data: plain });
    } catch (err) {
      toast.error(
        err.name === 'OperationError'
          ? 'Decryption failed — log in again to restore your key'
          : 'Failed to load secret'
      );
    }
  };

  // ── CREATE ─────────────────────────────────────────────────
  const handleCreateSecret = async (formData) => {
    if (!aesKey) { toast.error('Log in again to create secrets'); return false; }
    try {
      // Build type-specific plaintext payload
      let plain;
      switch (formData.category) {
        case 'card':
          plain = {
            cardholderName: formData.cardholderName || '',
            cardNumber:     formData.cardNumber     || '',
            expiry:         formData.expiry         || '',
            cvv:            formData.cvv            || '',
            notes:          formData.notes          || '',
          };
          break;
        case 'api_key':
          plain = {
            service:   formData.service   || '',
            apiKey:    formData.apiKey    || '',
            apiSecret: formData.apiSecret || '',
            endpoint:  formData.endpoint  || '',
            notes:     formData.notes     || '',
          };
          break;
        case 'note':
          plain = {
            content: formData.content || '',
            tags:    formData.tags    || '',
          };
          break;
        default: // login
          plain = {
            username: formData.username || '',
            password: formData.password || '',
            url:      formData.url      || '',
            notes:    formData.notes    || '',
          };
      }

      const { encryptedData, iv, authTag } = await encryptSecret(plain, aesKey);
      await axios.post('/vault', {
        name:     formData.name,
        category: formData.category || 'login',
        encryptedData, iv, authTag,
      });
      toast.success('Secret encrypted and stored!');
      fetchSecrets();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create secret');
      return false;
    }
  };

  // ── DELETE (two-step: set confirm state → execute) ────────
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/vault/${id}`);
      setSecrets((prev) => prev.filter((s) => s._id !== id));
      setConfirmDel(null);
      toast.success('Secret deleted');
    } catch { toast.error('Delete failed'); setConfirmDel(null); }
  };


  // ── TOGGLE FAVOURITE ───────────────────────────────────────
  const handleToggleFav = async (secret) => {
    try {
      await axios.put(`/vault/${secret._id}`, { isFavorite: !secret.isFavorite });
      setSecrets((prev) =>
        prev.map((s) => s._id === secret._id ? { ...s, isFavorite: !s.isFavorite } : s)
      );
    } catch { toast.error('Update failed'); }
  };

  // ── Category icon/colour map ───────────────────────────────
  const catStyles = {
    login:   { icon: 'vpn_key',         color: 'text-primary',            bg: 'bg-primary/10',            border: 'border-primary/20',            badge: 'bg-primary/10 text-primary border-primary/20' },
    work:    { icon: 'cloud',            color: 'text-secondary',          bg: 'bg-secondary/10',          border: 'border-secondary/20',          badge: 'bg-secondary/10 text-secondary border-secondary/20' },
    personal:{ icon: 'mail',             color: 'text-primary',            bg: 'bg-primary/10',            border: 'border-primary/20',            badge: 'bg-primary/10 text-primary border-primary/20' },
    crypto:  { icon: 'currency_bitcoin', color: 'text-tertiary-container', bg: 'bg-tertiary-container/10', border: 'border-tertiary-container/20', badge: 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' },
    card:    { icon: 'credit_card',      color: 'text-secondary',          bg: 'bg-secondary/10',          border: 'border-secondary/20',          badge: 'bg-secondary/10 text-secondary border-secondary/20' },
    note:    { icon: 'sticky_note_2',    color: 'text-outline',            bg: 'bg-outline/10',            border: 'border-outline/20',            badge: 'bg-outline/10 text-outline border-outline/20' },
    api_key: { icon: 'key',              color: 'text-tertiary-container', bg: 'bg-tertiary-container/10', border: 'border-tertiary-container/20', badge: 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' },
  };

  // ── Audit badge colours ────────────────────────────────────
  const auditBadge = {
    LOGIN:         'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]',
    LOGOUT:        'bg-primary/10 text-primary',
    SECRET_READ:   'bg-primary/10 text-primary',
    SECRET_CREATE: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]',
    SECRET_DELETE: 'bg-error/10 text-error',
    LOGIN_FAILED:  'bg-error/10 text-error',
  };

  return (
    <div className="font-body selection:bg-primary/30" style={{ paddingTop: '64px' }}>
      <div className="aurora-bg" />
      <div className="fixed inset-0 particle-dots pointer-events-none z-0" />

      {/* ── Main Content (full width, no sidebar) ──────────── */}
      <main className="relative z-10 p-8 md:p-12">

        {/* ── Page header ──────────────────────────────────── */}
        <header className="mb-12 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
              Primary Vault
            </h1>
            <p className="text-on-surface-variant max-w-md text-lg font-light">
              {loading
                ? 'Loading vault...'
                : `${totalSecrets} encrypted secret${totalSecrets !== 1 ? 's' : ''} · ${favoriteCount} favourite${favoriteCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Category quick-filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { val: 'all',     label: 'All'     },
              { val: 'login',   label: 'Logins'  },
              { val: 'card',    label: 'Cards'   },
              { val: 'api_key', label: 'API Keys'},
              { val: 'note',    label: 'Notes'   },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setCategory(val)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all active:scale-95
                  ${category === val
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'border-white/10 text-outline hover:border-white/20 hover:text-on-surface'}`}
              >
                {label}
                {val !== 'all' && categoryCount[val] ? (
                  <span className="ml-1.5 opacity-60">({categoryCount[val] || 0})</span>
                ) : null}
              </button>
            ))}
          </div>
        </header>

        {/* ── Search bar ───────────────────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-lowest border-none ring-1 ring-outline/20 focus:ring-2 focus:ring-primary/40 rounded-xl py-4 pl-12 pr-4 font-mono text-sm placeholder:text-outline/50 text-primary transition-all"
              placeholder="Search secrets by name, URL, or tag..."
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* shimmer keyframe */}
        <style>{`
          @keyframes shimmer {
            0%   { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}</style>

        {/* ── Secrets list ─────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: '86px', borderRadius: '16px',
                background: 'linear-gradient(90deg,rgba(12,20,40,0.6)25%,rgba(30,45,77,0.4)50%,rgba(12,20,40,0.6)75%)',
                backgroundSize: '200% auto',
                animation: `shimmer 1.4s ease-in-out ${i * 0.12}s infinite`,
                border: '1px solid rgba(126,255,245,0.06)',
              }} />
            ))
          ) : filteredSecrets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined text-outline/30 text-6xl">enhanced_encryption</span>
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
            filteredSecrets.map((secret) => {
              const s = catStyles[secret.category] || catStyles.login;
              return (
                <div
                  key={secret._id}
                  onClick={() => handleReveal(secret)}
                  className="glass-row group bg-surface-container-low/40 rounded-2xl border border-white/5 p-5 flex items-center gap-6 cursor-pointer hover:border-primary/20 hover:bg-surface-container-low/70 transition-all duration-200"
                >
                  <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center border ${s.border} shrink-0`}>
                    <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-headline font-bold text-lg text-on-surface truncate">{secret.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase tracking-wider shrink-0 ${s.badge}`}>
                        {secret.category || 'misc'}
                      </span>
                      {secret.isFavorite && (
                        <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-sm font-body">
                      {secret.lastAccessedAt
                        ? `Last accessed ${new Date(secret.lastAccessedAt).toLocaleDateString()}`
                        : 'Click to decrypt & reveal'}
                    </p>
                  </div>

                  <div className="hidden lg:block w-40">
                    <p className="text-[10px] text-outline uppercase font-bold mb-1">Updated</p>
                    <p className="font-mono text-sm text-on-surface">
                      {new Date(secret.updatedAt || secret.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="hidden lg:block w-32">
                    <p className="text-[10px] text-outline uppercase font-bold mb-1">Status</p>
                    <p className="text-primary text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">lock</span> Encrypted
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleFav(secret); }}
                      className={`w-10 h-10 rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center ${secret.isFavorite ? 'text-yellow-400' : 'text-outline hover:text-primary'}`}
                      title={secret.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
                    >
                      <span className="material-symbols-outlined">{secret.isFavorite ? 'star' : 'star_outline'}</span>
                    </button>

                    {/* Inline delete confirmation */}
                    {confirmDel === secret._id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs text-error font-bold whitespace-nowrap">Delete?</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(secret._id); }}
                          className="px-2 py-1 rounded bg-error/20 text-error text-xs font-bold hover:bg-error/35 transition-colors"
                        >Yes</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDel(null); }}
                          className="px-2 py-1 rounded bg-white/5 text-outline text-xs font-bold hover:bg-white/10 transition-colors"
                        >No</button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDel(secret._id); }}
                        className="w-10 h-10 rounded-lg hover:bg-error/10 hover:text-error transition-colors flex items-center justify-center text-outline"
                        title="Delete secret"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* ── Real Stats Bento (bottom) ─────────────────────── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Block 1: Secret breakdown by type */}
          <div className="bg-surface-container-low/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <p className="text-outline text-xs uppercase font-bold tracking-widest mb-4">Vault Breakdown</p>
            <p className="text-3xl font-headline font-bold text-on-surface mb-4">{totalSecrets} Secrets</p>
            <div className="space-y-2">
              {Object.entries({
                login:   { icon: 'vpn_key',      label: 'Logins'  },
                card:    { icon: 'credit_card',   label: 'Cards'   },
                api_key: { icon: 'key',           label: 'API Keys'},
                note:    { icon: 'sticky_note_2', label: 'Notes'   },
              }).map(([cat, { icon, label }]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-sm">{icon}</span>
                    <span className="text-xs text-on-surface-variant">{label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary">{categoryCount[cat] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Block 2: Favourites */}
          <div className="bg-surface-container-low/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
            <p className="text-outline text-xs uppercase font-bold tracking-widest mb-4">Favourites</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-yellow-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-3xl font-headline font-bold text-on-surface">{favoriteCount}</span>
            </div>
            {favoriteCount === 0 ? (
              <p className="text-on-surface-variant text-sm">Star secrets to pin them here.</p>
            ) : (
              <div className="space-y-1.5 mt-2">
                {secrets.filter((s) => s.isFavorite).slice(0, 3).map((s) => {
                  const st = catStyles[s.category] || catStyles.login;
                  return (
                    <div key={s._id} className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${st.color}`}>{st.icon}</span>
                      <span className="text-xs text-on-surface truncate">{s.name}</span>
                    </div>
                  );
                })}
                {favoriteCount > 3 && (
                  <p className="text-[10px] text-outline mt-1">+{favoriteCount - 3} more</p>
                )}
              </div>
            )}
          </div>

          {/* Block 3: Recent Audit Activity */}
          <div className="bg-surface-container-low/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/5 rounded-full blur-2xl group-hover:bg-tertiary-container/10 transition-colors" />
            <p className="text-outline text-xs uppercase font-bold tracking-widest mb-4">Recent Activity</p>
            {recentLogs.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log._id} className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${auditBadge[log.action] || 'bg-primary/10 text-primary'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-outline font-mono truncate">{log.ipAddress}</span>
                    <span className="shrink-0 text-xs">{log.success ? '✅' : '❌'}</span>
                  </div>
                ))}
                <a
                  href="/audit"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/audit'; }}
                  className="text-[10px] text-primary uppercase tracking-widest font-bold hover:underline"
                >
                  View full audit log →
                </a>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ── FAB ────────────────────────────────────────────── */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] text-[#002826] shadow-[0_10px_40px_rgba(111,241,231,0.4)] flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-50 border border-white/20"
        title="Add new secret"
      >
        <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-90">add</span>
      </button>

      {/* ── Mobile nav ───────────────────────────────────────  */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0b0e18]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 text-[#7EFFF5]">
          <span className="material-symbols-outlined">enhanced_encryption</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Vaults</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-outline" onClick={() => window.location.href = '/audit'}>
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Audit</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-outline" onClick={() => window.location.href = '/settings'}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
        </button>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showAdd && (
          <AddSecretModal onClose={() => setShowAdd(false)} onSubmit={handleCreateSecret} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {revealed && (
          <RevealModal secret={revealed} onClose={() => setRevealed(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared modal styles
// ─────────────────────────────────────────────────────────────────────────────
const inputCls = `
  w-full bg-surface-container-lowest border border-white/10 rounded-xl
  px-4 py-3 text-sm text-on-surface placeholder:text-outline
  font-mono focus:outline-none focus:border-primary/40 transition-colors
`;
const labelCls = `block text-[11px] font-bold text-outline uppercase tracking-[0.06em] mb-1.5`;

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddSecretModal  — type-specific forms
// ─────────────────────────────────────────────────────────────────────────────
function AddSecretModal({ onClose, onSubmit }) {
  const [category,   setCategory]   = useState('login');
  const [name,       setName]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPw,     setShowPw]     = useState(false);
  const [showCvv,    setShowCvv]    = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Login fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url,      setUrl]      = useState('');
  const [notes,    setNotes]    = useState('');

  // Card fields
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber,     setCardNumber]     = useState('');
  const [expiry,         setExpiry]         = useState('');
  const [cvv,            setCvv]            = useState('');

  // API Key fields
  const [service,   setService]   = useState('');
  const [apiKey,    setApiKey]    = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [endpoint,  setEndpoint]  = useState('');

  // Note fields
  const [content, setContent] = useState('');
  const [tags,    setTags]    = useState('');

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (category === 'card'    && !cardNumber.trim()) { toast.error('Card number is required'); return; }
    if (category === 'api_key' && !apiKey.trim())     { toast.error('API key is required');      return; }
    if (category === 'note'    && !content.trim())    { toast.error('Note content is required'); return; }

    setSubmitting(true);
    const ok = await onSubmit({
      name, category,
      // login
      username, password, url, notes,
      // card
      cardholderName, cardNumber, expiry, cvv,
      // api_key
      service, apiKey, apiSecret, endpoint,
      // note
      content, tags,
    });
    if (ok) onClose();
    else setSubmitting(false);
  };

  // Format card number with spaces every 4 digits
  const handleCardNumber = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  // Format expiry as MM/YY
  const handleExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) setExpiry(`${digits.slice(0,2)}/${digits.slice(2)}`);
    else setExpiry(digits);
  };

  // Category icon map
  const catMeta = {
    login:   { icon: 'vpn_key',         label: 'Login / Password', desc: 'Website, app, or service credentials' },
    card:    { icon: 'credit_card',      label: 'Payment Card',     desc: 'Debit, credit, or virtual card'        },
    api_key: { icon: 'key',             label: 'API Key',           desc: 'API key, token, or secret key'         },
    note:    { icon: 'sticky_note_2',    label: 'Secure Note',      desc: 'Encrypted freeform text or PIN'        },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[400] flex items-center justify-center p-6"
      style={{ background: 'rgba(4,6,15,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{   scale: 0.92, y: 24 }}
        transition={{ ease: [0.34, 1.56, 0.64, 1], duration: 0.45 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0C1428] border border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.75)' }}
      >
        <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-6">Add New Secret</h2>

        {/* ── Type selector ── */}
        <div className="mb-6">
          <label className={labelCls}>Type</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(catMeta).map(([val, { icon, label, desc }]) => (
              <button
                key={val}
                type="button"
                onClick={() => setCategory(val)}
                className={`p-3 rounded-xl border text-left transition-all
                  ${category === val
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-white/10 text-outline hover:border-white/20 hover:text-on-surface'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-base">{icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-[10px] opacity-60 leading-tight">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Name (all types) ── */}
        <Field label="Name *">
          <input
            className={inputCls}
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder={
              category === 'login'   ? 'Gmail, GitHub, Netflix...' :
              category === 'card'    ? 'My Visa Card, Work Amex...' :
              category === 'api_key' ? 'Stripe, OpenAI, AWS...' :
                                       'Meeting notes, PIN, Recovery key...'
            }
          />
        </Field>

        {/* ── LOGIN fields ── */}
        {category === 'login' && (<>
          <Field label="Username / Email">
            <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user@example.com" />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                className={inputCls}
                type={showPw ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: '60px' }}
              />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xs hover:text-primary transition-colors">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
          <Field label="URL (optional)">
            <input className={inputCls} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </Field>
          <Field label="Notes (optional)">
            <textarea className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." rows={2} style={{ resize: 'vertical' }} />
          </Field>
        </>)}

        {/* ── CARD fields ── */}
        {category === 'card' && (<>
          <Field label="Cardholder Name">
            <input className={inputCls} value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} placeholder="JOHN DOE" />
          </Field>
          <Field label="Card Number *">
            <input className={inputCls} value={cardNumber} onChange={(e) => handleCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry (MM/YY) *">
              <input className={inputCls} value={expiry} onChange={(e) => handleExpiry(e.target.value)}
                placeholder="MM/YY" maxLength={5} inputMode="numeric" />
            </Field>
            <Field label="CVV *">
              <div className="relative">
                <input className={inputCls} type={showCvv ? 'text' : 'password'}
                  value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                  placeholder="•••" maxLength={4} inputMode="numeric" style={{ paddingRight: '60px' }} />
                <button type="button" onClick={() => setShowCvv((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xs hover:text-primary transition-colors">
                  {showCvv ? 'Hide' : 'Show'}
                </button>
              </div>
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bank name, account type..." rows={2} style={{ resize: 'vertical' }} />
          </Field>
        </>)}

        {/* ── API KEY fields ── */}
        {category === 'api_key' && (<>
          <Field label="Service / Provider">
            <input className={inputCls} value={service} onChange={(e) => setService(e.target.value)} placeholder="OpenAI, Stripe, AWS..." />
          </Field>
          <Field label="API Key *">
            <div className="relative">
              <input className={inputCls} type={showApiKey ? 'text' : 'password'}
                value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-••••••••••••••••••••••" style={{ paddingRight: '60px' }} />
              <button type="button" onClick={() => setShowApiKey((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xs hover:text-primary transition-colors">
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
          <Field label="API Secret (optional)">
            <input className={inputCls} type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} placeholder="Secret key or token ID..." />
          </Field>
          <Field label="Endpoint / Base URL (optional)">
            <input className={inputCls} type="url" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://api.example.com/v1" />
          </Field>
          <Field label="Notes (optional)">
            <textarea className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Permissions, expiry date, environment..." rows={2} style={{ resize: 'vertical' }} />
          </Field>
        </>)}

        {/* ── NOTE fields ── */}
        {category === 'note' && (<>
          <Field label="Note Content *">
            <textarea className={inputCls} value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Write your secure note, PIN, recovery phrase, or any sensitive text..."
              rows={6} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </Field>
          <Field label="Tags (optional)">
            <input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="recovery, 2fa, wifi, pin..." />
          </Field>
        </>)}

        {/* Encryption notice */}
        <p className="text-[11px] text-outline/60 font-mono mb-6 mt-2">
          🔒 Encrypted with AES-256-GCM before leaving your browser
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-outline font-medium hover:border-white/25 hover:text-on-surface transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting
              ? <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              : '🔐 Encrypt & Save'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RevealModal  — type-aware field labels
// ─────────────────────────────────────────────────────────────────────────────
function RevealModal({ secret, onClose }) {
  const copy = (value, label) =>
    navigator.clipboard.writeText(value)
      .then(() => toast.success(`${label} copied!`))
      .catch(() => toast.error('Copy failed'));

  const [showSecret, setShowSecret] = useState({});

  // Human-readable labels per field key
  const FIELD_LABELS = {
    // login
    username: 'Username / Email',
    password: 'Password',
    url:      'URL',
    notes:    'Notes',
    // card
    cardholderName: 'Cardholder Name',
    cardNumber:     'Card Number',
    expiry:         'Expiry',
    cvv:            'CVV',
    // api_key
    service:   'Service / Provider',
    apiKey:    'API Key',
    apiSecret: 'API Secret',
    endpoint:  'Endpoint / Base URL',
    // note
    content: 'Note Content',
    tags:    'Tags',
  };

  // Fields that should be masked by default
  const SENSITIVE = new Set(['password', 'cvv', 'apiKey', 'apiSecret', 'content']);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[400] flex items-center justify-center p-6"
      style={{ background: 'rgba(4,6,15,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ ease: [0.34, 1.56, 0.64, 1], duration: 0.45 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0C1428] border border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.75)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-1">{secret.meta.name}</h2>
            <span className="text-[11px] text-outline font-mono uppercase tracking-wider">{secret.meta.category}</span>
          </div>
          <button onClick={onClose}
            className="text-outline hover:text-on-surface text-2xl leading-none transition-colors p-1">
            ×
          </button>
        </div>

        {/* Fields */}
        {Object.entries(secret.data)
          .filter(([, v]) => v && String(v).trim())
          .map(([key, value]) => {
            const isSensitive = SENSITIVE.has(key);
            const revealed    = showSecret[key];
            return (
              <div key={key} className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] text-outline font-mono uppercase tracking-wider">
                    {FIELD_LABELS[key] || key}
                  </p>
                  {isSensitive && (
                    <button
                      onClick={() => setShowSecret((p) => ({ ...p, [key]: !p[key] }))}
                      className="text-[10px] text-primary hover:underline font-mono"
                    >
                      {revealed ? 'Hide' : 'Reveal'}
                    </button>
                  )}
                </div>
                <div
                  onClick={() => copy(value, FIELD_LABELS[key] || key)}
                  title="Click to copy"
                  className="font-mono text-sm text-primary bg-primary/5 px-4 py-3 rounded-xl border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors flex justify-between items-center gap-3 break-all"
                >
                  <span>
                    {isSensitive && !revealed
                      ? '•'.repeat(Math.min(String(value).length, 32))
                      : value}
                  </span>
                  <span className="text-[10px] text-outline whitespace-nowrap shrink-0">click to copy</span>
                </div>
              </div>
            );
          })}

        <p className="text-[11px] text-outline/50 text-center mt-4 font-mono">
          🔒 Decrypted locally — never sent to server
        </p>
      </motion.div>
    </motion.div>
  );
}
