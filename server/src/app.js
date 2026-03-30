const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security headers ─────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// ── Body parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Request logging ──────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Health check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SecureVault API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ───────────────────────────────────────────────
const { apiLimiter, authLimiter, authSlowDown, vaultReadLimiter } = require('./middleware/rateLimiter');
const authRoutes   = require('./routes/auth.routes');
const vaultRoutes  = require('./routes/vault.routes');
const apikeyRoutes = require('./routes/apikey.routes');
const auditRoutes  = require('./routes/audit.routes');

// ── Rate limiting ─────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/auth/login',    authLimiter, authSlowDown);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/2fa',      authLimiter);
app.use('/api/vault',         vaultReadLimiter);

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/vault',   vaultRoutes);
app.use('/api/apikeys', apikeyRoutes);
app.use('/api/audit',   auditRoutes);

// ── 404 ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ─────────────────────────────────
app.use(errorHandler);

module.exports = app;