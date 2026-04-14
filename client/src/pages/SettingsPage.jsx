import React from 'react';
import { useState, useEffect } from 'react';
import toast                   from 'react-hot-toast';
import { useAuth }             from '../context/AuthContext';
import axios                   from '../api/axiosInstance';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();

  // ── State ─────────────────────────────────────────────────
  const [apiKeys,    setApiKeys]    = useState([]);
  const [auditLogs,  setAuditLogs]  = useState([]);
  const [qrCode,     setQrCode]     = useState(null);
  const [manualKey,  setManualKey]  = useState('');
  const [totpCode,   setTotpCode]   = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [loading,    setLoading]    = useState({});

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  // ── Load API keys + audit log on mount ────────────────────
  useEffect(() => {
    axios.get('/apikeys')
      .then((r) => setApiKeys(r.data.data.apiKeys || []))
      .catch(() => toast.error('Failed to load API keys'));

    axios.get('/audit?limit=15')
      .then((r) => setAuditLogs(r.data.data.logs || []))
      .catch(() => toast.error('Failed to load audit log'));
  }, []);

  // ── 2FA: Get QR code ──────────────────────────────────────
  const handle2FASetup = async () => {
    setLoad('setup', true);
    try {
      const { data } = await axios.post('/auth/2fa/setup');
      setQrCode(data.data.qrCode);
      setManualKey(data.data.manualKey);
      toast('Scan the QR code with Google Authenticator then enter the code below');
    } catch (err) {
      toast.error(err.response?.data?.message || '2FA setup failed');
    } finally {
      setLoad('setup', false);
    }
  };

  // ── 2FA: Confirm QR scanned and enable ────────────────────
  const handle2FAEnable = async () => {
    if (totpCode.length !== 6) {
      toast.error('Enter the 6-digit code from Google Authenticator');
      return;
    }
    setLoad('enable', true);
    try {
      await axios.post('/auth/2fa/enable', { totpToken: totpCode });
      setUser((prev) => ({ ...prev, isTwoFactorEnabled: true }));
      setQrCode(null);
      setTotpCode('');
      toast.success('2FA enabled! Required on next login.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code — try again');
    } finally {
      setLoad('enable', false);
    }
  };

  // ── 2FA: Disable ──────────────────────────────────────────
  const handle2FADisable = async () => {
    const code = window.prompt(
      'To disable 2FA, enter your current 6-digit Google Authenticator code:'
    );
    if (!code) return;

    setLoad('disable', true);
    try {
      await axios.post('/auth/2fa/disable', { totpToken: code.trim() });
      setUser((prev) => ({ ...prev, isTwoFactorEnabled: false }));
      toast.success('2FA disabled.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect code');
    } finally {
      setLoad('disable', false);
    }
  };

  // ── API Key: Create ───────────────────────────────────────
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Enter a name for the key first');
      return;
    }
    setLoad('createKey', true);
    try {
      const { data } = await axios.post('/apikeys', {
        name:        newKeyName.trim(),
        permissions: ['read'],
      });
      const { rawKey, ...keyMeta } = data.data.apiKey;
      try {
        await navigator.clipboard.writeText(rawKey);
        toast.success(`Key created and copied!\nPrefix: ${rawKey.substring(0, 20)}...`, { duration: 7000 });
      } catch {
        window.alert(`Your API Key (copy this now — shown only once):\n\n${rawKey}`);
      }
      setApiKeys((prev) => [...prev, keyMeta]);
      setNewKeyName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create key');
    } finally {
      setLoad('createKey', false);
    }
  };

  // ── API Key: Revoke ───────────────────────────────────────
  const handleRevokeKey = async (id, name) => {
    if (!window.confirm(`Revoke "${name}"?\nAny app using this key will immediately lose access.`)) return;
    try {
      await axios.delete(`/apikeys/${id}`);
      setApiKeys((prev) => prev.filter((k) => k._id !== id));
      toast.success('Key revoked');
    } catch {
      toast.error('Failed to revoke key');
    }
  };

  return (
    <div className="font-body selection:bg-primary/30 min-h-screen">
      <div className="aurora-bg"></div>
      <div className="fixed inset-0 particle-dots pointer-events-none z-0"></div>
      {/* TopAppBar */}
      <header className="bg-[#0b0e18]/80 backdrop-blur-lg border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] docked full-width top-0 z-50 flex justify-between items-center px-8 py-4 w-full sticky">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7EFFF5]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <span className="text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">SecureVault</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <a className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300 font-['Space_Grotesk']" href="/vault">Vaults</a>
            <a className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300 font-['Space_Grotesk']" href="#">Audit Log</a>
          </nav>
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-[#7EFFF5] transition-colors">notifications</span>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-[#7EFFF5] transition-colors">settings</span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG9_CFbdqUFSfosY0nAAQq8gDMIjwaBoYp-dhnxjtMHJvbffXiJDYwF7YW5vyxpiFFiedshON_FcWY9RCLL2fyWl7nZITbqwsiS8QCkd6_r0BZpdd6suDtomgU_U-SYxPtSHYENtpQFYoa-Sayw6aW9POu7chIXmTRS2clVNQvWporBi3n_48ThQLiAK2HP6nwq9mGQeTGWUSpnKlLAgVo5TWsJdwFG9nfK77VypZByJUqm8ZU67U5P9R0vfOgg6WWlPAL7bIg09Y" />
            </div>
            <div className="mt-auto p-6">
            <button
              onClick={logout}
              className="w-full py-3 bg-secondary-container text-on-secondary-container font-black text-xs uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Lock All Vaults
            </button>
          </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Main Canvas */}
        <main className="flex-1 lg:ml-72 p-8 md:p-12 max-w-7xl">
          <header className="mb-12">
            <h1 className="text-5xl font-black font-headline tracking-tighter mb-4 text-on-surface">Security Preferences</h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">Configure your quantum-level defense parameters. All changes are propagated through the neural encrypted mesh instantly.</p>
          </header>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* 2FA Control Panel */}
            <section className="md:col-span-4 glass-card p-8 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-tertiary-fixed text-3xl">vibration</span>
                  <h3 className="font-headline font-bold text-xl uppercase tracking-wider text-on-surface">Multi-Factor</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-8">Hardware-backed authentication using biometric keys and TOTP synchronization.</p>
              </div>
              <div className="space-y-4 mt-2">

                {/* ── 2FA not enabled, no QR yet ── */}
                {!user?.isTwoFactorEnabled && !qrCode && (
                  <div className="p-4 bg-surface-container-lowest rounded-lg border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-on-surface">Authenticator App (TOTP)</p>
                      <p className="text-xs text-outline mt-0.5">Not enabled</p>
                    </div>
                    <button
                      onClick={handle2FASetup}
                      disabled={loading.setup}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider hover:bg-primary/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading.setup ? 'Setting up…' : 'Enable 2FA'}
                    </button>
                  </div>
                )}

                {/* ── QR code step ── */}
                {qrCode && (
                  <div className="p-4 bg-surface-container-lowest rounded-lg border border-primary/20 flex flex-col gap-4">
                    <p className="text-xs text-on-surface-variant">Scan with Google Authenticator:</p>
                    <img
                      src={qrCode}
                      alt="2FA QR Code"
                      className="rounded-xl border border-white/10"
                      style={{ width: 180, height: 180 }}
                    />
                    {manualKey && (
                      <p className="text-xs text-outline">
                        Can't scan? Enter manually:&nbsp;
                        <code className="text-primary break-all">{manualKey}</code>
                      </p>
                    )}
                    <input
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit code"
                      maxLength={6}
                      inputMode="numeric"
                      className="w-full text-center tracking-[0.25em] text-xl font-mono bg-surface-container p-3 rounded-lg border border-white/10 text-primary placeholder:text-outline focus:outline-none focus:border-primary/40"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handle2FAEnable}
                        disabled={loading.enable || totpCode.length !== 6}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                      >
                        {loading.enable ? 'Enabling…' : 'Confirm & Enable'}
                      </button>
                      <button
                        onClick={() => { setQrCode(null); setTotpCode(''); }}
                        className="px-4 py-2 rounded-lg border border-white/10 text-outline text-xs hover:border-white/20 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* ── 2FA is active ── */}
                {user?.isTwoFactorEnabled && (
                  <div className="p-4 bg-surface-container-lowest rounded-lg border border-tertiary-container/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary-container text-lg" data-icon="verified_user">verified_user</span>
                      <div>
                        <p className="text-sm font-medium text-on-surface">2FA is active</p>
                        <p className="text-xs text-tertiary-container mt-0.5">Required on every login</p>
                      </div>
                    </div>
                    <button
                      onClick={handle2FADisable}
                      disabled={loading.disable}
                      className="px-4 py-2 rounded-lg bg-error/10 text-error border border-error/20 text-xs font-bold uppercase tracking-wider hover:bg-error/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading.disable ? 'Disabling…' : 'Disable 2FA'}
                    </button>
                  </div>
                )}

                {/* Static YubiKey row (coming soon) */}
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-white/5 opacity-50">
                  <span className="text-sm font-medium text-on-surface">YubiKey Support</span>
                  <span className="text-xs text-outline uppercase tracking-widest">Coming soon</span>
                </div>

              </div>
            </section>
            {/* API Key Management */}
            <section className="md:col-span-8 glass-card p-8 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">api</span>
                <h3 className="font-headline font-bold text-xl uppercase tracking-wider text-on-surface">Neural API Nodes</h3>
              </div>

              {/* Create key form */}
              <div className="flex gap-3 mb-6">
                <input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                  placeholder="Key name e.g. My CLI Tool"
                  className="flex-1 bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-outline font-mono focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  onClick={handleCreateKey}
                  disabled={loading.createKey}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(111,241,231,0.3)] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {loading.createKey ? 'Creating…' : '+ Generate Node'}
                </button>
              </div>

              {/* Key list */}
              {apiKeys.length === 0 ? (
                <div className="text-center py-10 text-outline text-sm">
                  No API keys yet. Create one above.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/5">
                  {apiKeys.map((key) => (
                    <div key={key._id} className="flex items-center gap-4 py-4 group">
                      {/* Name + prefix */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface text-sm truncate">{key.name}</p>
                        <code className="text-xs text-outline font-mono">{key.keyPrefix}</code>
                      </div>

                      {/* Permission badges */}
                      <div className="hidden sm:flex gap-1 shrink-0">
                        {(key.permissions || []).map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20 font-mono uppercase"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      {/* Last used */}
                      {key.lastUsedAt && (
                        <span className="hidden lg:block text-xs text-outline shrink-0">
                          {new Date(key.lastUsedAt).toLocaleDateString()}
                        </span>
                      )}

                      {/* Revoke */}
                      <button
                        onClick={() => handleRevokeKey(key._id, key.name)}
                        className="px-3 py-1.5 rounded-lg bg-error/10 text-error border border-error/20 text-xs font-bold hover:bg-error/20 active:scale-95 transition-all shrink-0"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
            {/* Audit Log Terminal */}
            <section className="md:col-span-12 glass-card p-8 rounded-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-secondary text-3xl">history_edu</span>
                <h3 className="font-headline font-bold text-xl uppercase tracking-wider text-on-surface">Recent Telemetry</h3>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg font-mono text-sm leading-loose border border-white/5 max-h-80 overflow-y-auto custom-scrollbar">
                {(() => {
                  const ACTION_COLOR = {
                    LOGIN:          { border: 'border-[#C8FF57]', badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]' },
                    LOGOUT:         { border: 'border-primary',   badge: 'bg-primary/10 text-primary' },
                    REGISTER:       { border: 'border-[#C8FF57]', badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]' },
                    SECRET_READ:    { border: 'border-primary',   badge: 'bg-primary/10 text-primary' },
                    SECRET_CREATE:  { border: 'border-[#C8FF57]', badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]' },
                    SECRET_UPDATE:  { border: 'border-primary',   badge: 'bg-primary/10 text-primary' },
                    SECRET_DELETE:  { border: 'border-error',     badge: 'bg-error/10 text-error' },
                    LOGIN_FAILED:   { border: 'border-error',     badge: 'bg-error/10 text-error' },
                    TWO_FA_ENABLED: { border: 'border-[#C8FF57]', badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]' },
                    APIKEY_CREATED: { border: 'border-secondary', badge: 'bg-secondary/10 text-secondary' },
                    APIKEY_USED:    { border: 'border-primary',   badge: 'bg-primary/10 text-primary' },
                    APIKEY_REVOKED: { border: 'border-error',     badge: 'bg-error/10 text-error' },
                  };

                  return auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-outline">No activity recorded yet.</div>
                  ) : (
                    auditLogs.map((log) => {
                      const s = ACTION_COLOR[log.action] || ACTION_COLOR.SECRET_READ;
                      return (
                        <div
                          key={log._id}
                          className={`flex items-center gap-3 border-l-2 ${s.border} pl-4 py-2 mb-1 hover:bg-white/5 transition-colors group`}
                        >
                          {/* Action badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${s.badge}`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>

                          {/* IP */}
                          <span className="flex-1 text-xs text-outline truncate">
                            {log.ipAddress}
                          </span>

                          {/* Timestamp */}
                          <span className="text-xs text-outline/60 shrink-0 hidden sm:block">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>

                          {/* Success indicator */}
                          <span className="shrink-0 text-sm">
                            {log.success ? '✅' : '❌'}
                          </span>
                        </div>
                      );
                    })
                  );
                })()}
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
