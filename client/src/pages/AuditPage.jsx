import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';

// ─── Token helper ─────────────────────────────────────────────────────────────
const getLiveToken = () => {
  const h = axios.defaults.headers.common['Authorization'] || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
};

// ─── Action colour map (Tailwind classes matching SettingsPage) ───────────────
const ACTION_COLOR = {
  LOGIN:            { border: 'border-[#C8FF57]',    badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]'   },
  LOGIN_FAILED:     { border: 'border-error',         badge: 'bg-error/10 text-error'                      },
  LOGOUT:           { border: 'border-primary',       badge: 'bg-primary/10 text-primary'                  },
  REGISTER:         { border: 'border-[#C8FF57]',    badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]'   },
  EMAIL_VERIFIED:   { border: 'border-[#C8FF57]',    badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]'   },
  PASSWORD_CHANGED: { border: 'border-secondary',     badge: 'bg-secondary/10 text-secondary'              },
  TWO_FA_ENABLED:   { border: 'border-[#C8FF57]',    badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]'   },
  TWO_FA_DISABLED:  { border: 'border-error',         badge: 'bg-error/10 text-error'                      },
  SECRET_READ:      { border: 'border-primary',       badge: 'bg-primary/10 text-primary'                  },
  SECRET_CREATE:    { border: 'border-[#C8FF57]',    badge: 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57]'   },
  SECRET_UPDATE:    { border: 'border-primary',       badge: 'bg-primary/10 text-primary'                  },
  SECRET_DELETE:    { border: 'border-error',         badge: 'bg-error/10 text-error'                      },
  APIKEY_CREATED:   { border: 'border-secondary',     badge: 'bg-secondary/10 text-secondary'              },
  APIKEY_USED:      { border: 'border-primary',       badge: 'bg-primary/10 text-primary'                  },
  APIKEY_REVOKED:   { border: 'border-error',         badge: 'bg-error/10 text-error'                      },
};
const DEFAULT_COLOR = ACTION_COLOR.SECRET_READ;

const ALL_ACTIONS = [
  'all',
  'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'REGISTER', 'EMAIL_VERIFIED',
  'PASSWORD_CHANGED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED',
  'SECRET_READ', 'SECRET_CREATE', 'SECRET_UPDATE', 'SECRET_DELETE',
  'APIKEY_CREATED', 'APIKEY_USED', 'APIKEY_REVOKED',
];

// ─── XML helper ───────────────────────────────────────────────────────────────
const logsToXML = (logs) => {
  const e = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const rows = logs.map((l) => `
  <log>
    <id>${e(l._id)}</id>
    <action>${e(l.action)}</action>
    <success>${l.success}</success>
    <ip>${e(l.ipAddress)}</ip>
    <userAgent>${e(l.userAgent)}</userAgent>
    <createdAt>${e(l.createdAt)}</createdAt>
  </log>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<auditLogs>${rows}\n</auditLogs>`;
};

const download = (content, name, mime) => {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([content], { type: mime })),
    download: name,
  });
  a.click();
  URL.revokeObjectURL(a.href);
};

// ─── Single log row ───────────────────────────────────────────────────────────
function LogRow({ log, isNew = false }) {
  const s       = ACTION_COLOR[log.action] || DEFAULT_COLOR;
  const isBad   = log.action === 'LOGIN_FAILED' || !log.success;
  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -12 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 border-l-2 ${s.border} pl-4 py-3 mb-1
        hover:bg-white/5 transition-colors group
        ${isBad ? 'bg-error/5 shadow-[inset_0_0_20px_rgba(200,0,0,0.05)]' : ''}
        ${isNew ? 'bg-primary/5' : ''}`}
    >
      {/* Action badge */}
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap font-mono ${s.badge} shrink-0`}>
        {log.action.replace(/_/g, ' ')}
      </span>

      {/* IP */}
      <span className="text-xs text-outline font-mono shrink-0 hidden sm:block w-28 truncate" title={log.ipAddress}>
        {log.ipAddress}
      </span>

      {/* User-agent */}
      <span className="flex-1 text-xs text-outline/60 truncate hidden md:block" title={log.userAgent}>
        {log.userAgent}
      </span>

      {/* Timestamp */}
      <span className="text-xs text-outline/60 shrink-0 hidden sm:block">
        {new Date(log.createdAt).toLocaleString()}
      </span>

      {/* Success */}
      <span className="shrink-0 text-sm">{log.success ? '✅' : '❌'}</span>

      {/* LIVE badge */}
      {isNew && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shrink-0">
          LIVE
        </span>
      )}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AuditPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [actionFilter,  setActionFilter]  = useState('all');
  const [successFilter, setSuccessFilter] = useState('all');
  const [logs,          setLogs]          = useState([]);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [page,          setPage]          = useState(1);
  const [fetching,      setFetching]      = useState(true);
  const [newEntries,    setNewEntries]    = useState([]);
  const [connected,     setConnected]     = useState(false);
  const esRef = useRef(null);
  const LIMIT   = 25;
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ── Fetch paginated (with filters) ────────────────────────
  const fetchLogs = useCallback(async () => {
    setFetching(true);
    try {
      const params = { page, limit: LIMIT };
      if (actionFilter  !== 'all') params.action  = actionFilter;
      if (successFilter !== 'all') params.success  = successFilter;
      const { data } = await axios.get('/audit', { params });
      setLogs(data.data.logs       || []);
      setTotal(data.data.total     || 0);
      setTotalPages(data.data.totalPages || 1);
    } catch { toast.error('Failed to load audit logs'); }
    finally  { setFetching(false); }
  }, [page, actionFilter, successFilter]);

  useEffect(() => { fetchLogs(); setNewEntries([]); }, [fetchLogs]);

  // ── SSE stream ────────────────────────────────────────────
  useEffect(() => {
    const token = getLiveToken() || accessToken;
    if (!token) return;
    const es = new EventSource(`${BASE_URL}/audit/stream?token=${encodeURIComponent(token)}`);
    esRef.current = es;
    es.onopen    = ()  => setConnected(true);
    es.onerror   = ()  => setConnected(false);
    es.onmessage = (e) => {
      try {
        const log = JSON.parse(e.data);
        setNewEntries((p) => [log, ...p].slice(0, 50));
        setTotal((t) => t + 1);
      } catch {/* ignore */}
    };
    return () => { es.close(); setConnected(false); };
  }, [accessToken, BASE_URL]);

  // ── Exports ───────────────────────────────────────────────
  const allVisible = [...newEntries, ...logs];
  const exportJSON = () => download(JSON.stringify(allVisible, null, 2), 'audit-logs.json', 'application/json');
  const exportXML  = () => download(logsToXML(allVisible), 'audit-logs.xml', 'application/xml');

  // ── Page number pills (max 5 centred around current) ──────
  const pagePills = () => {
    const count = Math.min(5, totalPages);
    let start   = Math.max(1, page - Math.floor(count / 2));
    start       = Math.min(start, totalPages - count + 1);
    return Array.from({ length: count }, (_, i) => start + i);
  };

  return (
    <div className="font-body selection:bg-primary/30 min-h-screen" style={{ paddingTop: '64px' }}>
      <div className="aurora-bg" />
      <div className="fixed inset-0 particle-dots pointer-events-none z-0" />

      <main className="relative z-10 p-8 md:p-12">

        {/* ── Page header ──────────────────────────── */}
        <header className="mb-12 flex justify-between items-end flex-wrap gap-6">
          <div>
            {/* Title + live pill */}
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface">
                Audit Log
              </h1>
              {/* Live indicator */}
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono border
                ${connected
                  ? 'bg-[rgba(200,255,87,0.1)] text-[#C8FF57] border-[rgba(200,255,87,0.3)]'
                  : 'bg-white/5 text-outline border-white/10'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#C8FF57] animate-pulse' : 'bg-outline'}`} />
                {connected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-on-surface-variant max-w-2xl text-lg font-light leading-relaxed">
              {total.toLocaleString()} security events · auto-purged after 90 days
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex gap-3">
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider hover:bg-primary/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              JSON
            </button>
            <button
              onClick={exportXML}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold uppercase tracking-wider hover:bg-secondary/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              XML
            </button>
          </div>
        </header>

        {/* ── Stats bento strip ────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Events',  value: total,                       icon: 'history_edu',         color: 'text-primary'   },
            { label: 'Live Updates',  value: newEntries.length,           icon: 'bolt',                color: 'text-[#C8FF57]' },
            { label: 'Current Page',  value: `${page} / ${totalPages}`,   icon: 'menu_book',           color: 'text-secondary' },
            { label: 'Showing',       value: logs.length + newEntries.length, icon: 'filter_list',     color: 'text-outline'   },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className={`material-symbols-outlined ${color} text-xl`}>{icon}</span>
                <p className="text-[10px] text-outline uppercase font-bold tracking-[0.15em]">{label}</p>
              </div>
              <p className={`text-3xl font-headline font-extrabold tracking-tighter ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Main log panel ───────────────────────── */}
        <section className="glass-card rounded-xl overflow-hidden">

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 p-6 border-b border-white/5">
            <span className="material-symbols-outlined text-outline text-lg">filter_alt</span>
            <p className="text-[10px] text-outline uppercase font-bold tracking-[0.15em] mr-2">Filters</p>

            {/* Action dropdown */}
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface font-mono focus:outline-none focus:border-primary/40 transition-colors cursor-pointer"
            >
              {ALL_ACTIONS.map((a) => (
                <option key={a} value={a}>{a === 'all' ? 'All Actions' : a.replace(/_/g, ' ')}</option>
              ))}
            </select>

            {/* Success / fail toggles */}
            <div className="flex gap-2">
              {[
                { val: 'all',   label: 'All',          cls: 'text-on-surface border-white/10 hover:border-white/20' },
                { val: 'true',  label: '✅ Success',    cls: 'text-[#C8FF57] border-[rgba(200,255,87,0.3)] bg-[rgba(200,255,87,0.05)]' },
                { val: 'false', label: '❌ Failures',   cls: 'text-error border-error/30 bg-error/5' },
              ].map(({ val, label, cls }) => (
                <button
                  key={val}
                  onClick={() => { setSuccessFilter(val); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all active:scale-95
                    ${successFilter === val
                      ? cls
                      : 'text-outline border-white/5 hover:border-white/15 hover:text-on-surface'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Clear */}
            {(actionFilter !== 'all' || successFilter !== 'all') && (
              <button
                onClick={() => { setActionFilter('all'); setSuccessFilter('all'); setPage(1); }}
                className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-error border border-error/20 hover:bg-error/10 active:scale-95 transition-all"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Column headers */}
          <div className="hidden md:flex items-center gap-3 px-6 py-3 border-b border-white/5 bg-surface-container-lowest/40">
            {['Action', 'IP Address', 'User Agent', 'Timestamp', ''].map((h, i) => (
              <span
                key={i}
                className={`text-[10px] text-outline uppercase font-bold tracking-[0.15em] font-mono ${i === 2 ? 'flex-1' : 'shrink-0'} ${i === 2 ? '' : i === 0 ? 'w-36' : i === 1 ? 'w-28' : i === 3 ? 'w-40' : 'w-16'}`}
              >{h}</span>
            ))}
          </div>

          {/* Live entries (page 1 only) */}
          <AnimatePresence>
            {newEntries.length > 0 && page === 1 && (
              <div className="border-b border-primary/10">
                <div className="px-6 py-2 bg-primary/5 border-b border-primary/10">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-[0.15em] font-mono">
                    ● {newEntries.length} new live event{newEntries.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="bg-surface-container-lowest/20 px-2">
                  {newEntries.map((log) => <LogRow key={log._id} log={log} isNew />)}
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Paginated rows */}
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-[3px] border-white/10 border-t-primary rounded-full animate-spin" />
              <p className="text-outline text-xs uppercase tracking-widest font-mono">Fetching telemetry...</p>
            </div>
          ) : logs.length === 0 && newEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="material-symbols-outlined text-outline text-5xl">search_off</span>
              <p className="text-on-surface-variant text-sm">No events match these filters</p>
              <button
                onClick={() => { setActionFilter('all'); setSuccessFilter('all'); setPage(1); }}
                className="px-4 py-2 mt-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider hover:bg-primary/20 active:scale-95 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="px-2 py-2 bg-surface-container-lowest/10">
              {logs.map((log) => <LogRow key={log._id} log={log} />)}
            </div>
          )}
        </section>

        {/* ── Pagination ───────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
            <span className="text-xs text-outline font-mono uppercase tracking-wider">
              Page {page} of {totalPages} · {total.toLocaleString()} total events
            </span>
            <nav className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-white/10 text-outline text-xs font-bold hover:border-white/20 hover:text-on-surface active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {pagePills().map((pg) => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all active:scale-95
                    ${pg === page
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'border-white/10 text-outline hover:border-white/20 hover:text-on-surface'}`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-white/10 text-outline text-xs font-bold hover:border-white/20 hover:text-on-surface active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </nav>
          </div>
        )}

      </main>

      {/* ── Mobile bottom nav ────────────────────── */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 glass-card p-3 rounded-full shadow-2xl border border-primary/20">
        <button onClick={() => navigate('/vault')} className="w-12 h-12 flex items-center justify-center text-primary-dim hover:text-primary transition-colors">
          <span className="material-symbols-outlined">enhanced_encryption</span>
        </button>
        <button className="w-12 h-12 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(111,241,231,0.5)]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
        </button>
        <button onClick={() => navigate('/settings')} className="w-12 h-12 flex items-center justify-center text-primary-dim hover:text-primary transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </div>
  );
}
