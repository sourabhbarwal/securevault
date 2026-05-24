<div align="center">

<img src="https://img.shields.io/badge/AES--256--GCM-Encrypted-7EFFF5?style=for-the-badge&logo=shield&logoColor=black" />
<img src="https://img.shields.io/badge/Zero--Knowledge-Architecture-FF3CAC?style=for-the-badge" />
<img src="https://img.shields.io/badge/Live-Deployed-C8FF57?style=for-the-badge&logo=vercel&logoColor=black" />

<br/><br/>

```
███████╗███████╗ ██████╗██╗   ██╗██████╗ ███████╗██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗
██╔════╝██╔════╝██╔════╝██║   ██║██╔══██╗██╔════╝██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝
███████╗█████╗  ██║     ██║   ██║██████╔╝█████╗  ██║   ██║███████║██║   ██║██║     ██║   
╚════██║██╔══╝  ██║     ██║   ██║██╔══██╗██╔══╝  ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   
███████║███████╗╚██████╗╚██████╔╝██║  ██║███████╗ ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   
╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   
```

#  SecureVault

### Zero-Knowledge Password Manager & Encrypted Secrets API

**Your passwords are encrypted in your browser before they ever reach the server.**
**We store only ciphertext — mathematically unreadable without your master key.**

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-securevault--smoky.vercel.app-7EFFF5?style=for-the-badge)](https://securevault-smoky.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-sourabhbarwal%2Fsecurevault-white?style=for-the-badge&logo=github&logoColor=black)](https://github.com/sourabhbarwal/securevault)

<br/>
</div>

---

## 📋 Table of Contents

- [What is SecureVault?](#-what-is-securevault)
- [Why Zero-Knowledge?](#-why-zero-knowledge)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [How Encryption Works](#-how-encryption-works)
- [API Reference](#-api-reference)
- [Security Model](#-security-model)
- [Performance & Capacity](#-performance--capacity)
- [Author](#-author)

---

## 🔐 What is SecureVault?

SecureVault is a **production-grade, self-hostable password manager** built with a zero-knowledge security model. It allows individuals and developers to securely store passwords, API keys, credit card details, and private notes — with the guarantee that the server **never has access to the plaintext data**.

Unlike traditional password managers that encrypt data on the server, SecureVault encrypts everything **inside your browser** using the Web Crypto API before any data is transmitted. The server receives — and stores — only encrypted blobs of ciphertext.

### The core promise:
> Even if the entire database is leaked, every secret inside remains completely unreadable.  
> The only way to decrypt is with the user's master password — which never leaves their device.

### Who is it for?

| User | Use Case |
|---|---|
| **Developers** | Store API keys, SSH passwords, database credentials |
| **Students** | Secure academic and personal account passwords |
| **Teams** | Share infrastructure credentials via API key access |
| **Privacy-conscious users** | Self-host a password manager they fully control |

---

## 🧠 Why Zero-Knowledge?

Most password managers that claim to be "secure" encrypt your data **on their server** — meaning they hold the decryption key. This creates a single point of trust:

```
Traditional:   Your Password → Sent to Server → Server Encrypts → Stores
SecureVault:   Your Password → Browser Encrypts → Ciphertext Sent → Server Stores Gibberish
```

In SecureVault's model:

1. **Your master password never leaves your browser** — not even as a hash
2. **The server never sees plaintext** — it receives and stores encrypted blobs only
3. **Encryption keys are derived fresh on every login** — using PBKDF2 with 100,000 iterations
4. **Even Sourabh (the developer) cannot read your secrets** — the architecture makes it technically impossible
5. **Database breach = zero data exposure** — attackers get only unreadable ciphertext

---

## 🌐 Live Demo

| Service | URL | Status |
|---|---|---|
| **Frontend** | [https://securevault-smoky.vercel.app](https://securevault-smoky.vercel.app) | ![Vercel](https://img.shields.io/badge/Vercel-Live-C8FF57?style=flat) |
| **Backend API** | [https://securevault-api-tm97.onrender.com](https://securevault-api-tm97.onrender.com) | ![Render](https://img.shields.io/badge/Render-Live-7EFFF5?style=flat) |
| **Health Check** | [/health](https://securevault-api-tm97.onrender.com/health) | ![Health](https://img.shields.io/badge/Health-OK-C8FF57?style=flat) |

> ⚠️ **Free tier note:** The backend runs on Render's free plan and may take up to **30 seconds** to wake up after a period of inactivity. Once awake, all responses are fast. An UptimeRobot monitor pings the server every 5 minutes to minimize sleep time.

### Try it out

```
Test Account (feel free to use):
Email:    demo@securevault.dev
Password: Demo@12345
```
> Or register your own account — it takes 20 seconds.

---

## ✨ Features

### 🔒 Security Core
- **Zero-Knowledge Architecture** — AES-256-GCM encryption runs entirely in the browser
- **PBKDF2 Key Derivation** — 100,000 iterations of SHA-256 to derive the AES key from master password
- **Per-user Encryption Salt** — unique 32-byte random salt stored server-side, used with PBKDF2
- **GCM Authentication Tags** — every encrypted blob includes a 128-bit auth tag ensuring integrity
- **IV Randomization** — fresh 96-bit initialization vector generated for every single encryption

### 🔑 Authentication System
- **JWT Access Tokens** — 15-minute expiry, signed with HS256
- **Refresh Token Rotation** — 7-day HttpOnly cookies, up to 5 concurrent device sessions
- **TOTP 2FA** — RFC 6238 compliant, compatible with Google Authenticator, Authy, 1Password
- **QR Code Setup** — styled QR code with custom colours for authenticator app scanning
- **Email Verification** — styled HTML verification emails on registration
- **Brute-Force Protection** — 10 attempts per 15 minutes on auth routes with progressive slow-down

### 🗄️ Vault Management
- **4 Secret Categories** — Login, Card, Note, API Key
- **Metadata-only List View** — list endpoint never returns encrypted blobs; decryption only on explicit reveal
- **Favourites** — pin important secrets to the top
- **Full-text Search** — filter secrets by name in real time
- **Last Accessed Tracking** — timestamp updated on every reveal

### ⚡ Real-Time System
- **Socket.io WebSockets** — authenticated connections with JWT middleware
- **Cross-tab Vault Sync** — add/delete in one tab, all open tabs update within 2 seconds
- **Live Audit Streaming** — new audit log entries appear instantly in Settings page
- **Polling → WebSocket Upgrade** — starts with HTTP long-polling, upgrades to full WebSocket automatically
- **Auto-reconnect** — 10 reconnection attempts with exponential backoff (max 10 seconds delay)

### 🔑 Developer API Key System
- **Bcrypt-hashed Storage** — raw API keys never stored; only their bcrypt hash (cost factor 10)
- **Prefix Identification** — first 16 chars shown to identify keys without exposing them
- **3 Permission Tiers** — `read`, `write`, `delete` — assignable independently
- **Last Used Tracking** — timestamp updated on every API request
- **Optional Expiry** — keys can be set to expire after N days
- **One-time Display** — raw key shown exactly once at creation, then unrecoverable

### 📊 Audit & Compliance
- **15+ Event Types** — LOGIN, LOGOUT, REGISTER, SECRET_READ, SECRET_CREATE, SECRET_UPDATE, SECRET_DELETE, TWO_FA_ENABLED, TWO_FA_DISABLED, APIKEY_CREATED, APIKEY_USED, APIKEY_REVOKED, PASSWORD_CHANGED, EMAIL_VERIFIED, LOGIN_FAILED
- **IP + User Agent Logging** — every event records source IP and browser fingerprint
- **Success/Failure Tracking** — failed login attempts logged separately with false flag
- **90-day Auto-expiry** — MongoDB TTL index automatically purges logs older than 90 days
- **Paginated History** — fetch up to 20 audit entries per page

### 🎨 User Interface
- **"Encrypted Universe" Aesthetic** — deep space dark theme designed in Google Stitch
- **Aurora Backgrounds** — animated radial gradient orbs with twinkling particle stars
- **Glassmorphism Cards** — `backdrop-filter: blur()` panels with cyan glow borders
- **Antigravity Animations** — floating elements, spring-physics modals, shake-on-error
- **Syne + Satoshi + JetBrains Mono** — premium font trio for display, body, and code
- **Real-time Connection Indicator** — green/red dot in navbar shows WebSocket status
- **Responsive** — works on desktop, tablet, and mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool + dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 11 | Animations |
| React Router v6 | 6 | Client-side routing |
| TanStack React Query | 5 | Data fetching + caching |
| Socket.io Client | 4 | WebSocket connection |
| Axios | 1.x | HTTP client with interceptors |
| React Hot Toast | 2 | Toast notifications |
| Lucide React | 0.x | Icon library |
| Web Crypto API | Native | AES-256-GCM encryption |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express.js | 4 | HTTP framework |
| Socket.io | 4 | WebSocket server |
| Mongoose | 8 | MongoDB ODM |
| bcryptjs | 2 | Password + API key hashing |
| jsonwebtoken | 9 | JWT signing + verification |
| speakeasy | 2 | TOTP 2FA generation + verification |
| qrcode | 1 | QR code generation for 2FA |
| nodemailer | 6 | Email sending |
| express-rate-limit | 7 | Rate limiting middleware |
| express-slow-down | 2 | Progressive request slow-down |
| express-validator | 7 | Input validation |
| cors | 2 | Cross-origin resource sharing |
| helmet | 7 | Security HTTP headers |
| morgan | 1 | HTTP request logging |
| cookie-parser | 1 | Cookie parsing middleware |

### Infrastructure
| Service | Purpose | Tier |
|---|---|---|
| MongoDB Atlas | Database | Free (512 MB) |
| Render | Backend hosting | Free |
| Vercel | Frontend hosting + CDN | Free |
| UptimeRobot | Backend uptime monitoring | Free |
| Gmail SMTP | Transactional email | Free |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   React Application                          │   │
│  │                                                              │   │
│  │   ┌──────────────┐    ┌──────────────┐    ┌─────────────┐  │   │
│  │   │  AuthContext  │    │ React Query  │    │  SocketCtx  │  │   │
│  │   │  (aesKey ref) │    │  (cache/sync)│    │  (realtime) │  │   │
│  │   └──────┬───────┘    └──────┬───────┘    └──────┬──────┘  │   │
│  │          │                   │                    │          │   │
│  │   ┌──────▼───────────────────▼────────────────────▼──────┐  │   │
│  │   │              Web Crypto API (AES-256-GCM)             │  │   │
│  │   │                                                       │  │   │
│  │   │  masterPassword + encryptionSalt                      │  │   │
│  │   │         │                                             │  │   │
│  │   │         ▼  PBKDF2 (100K iterations)                  │  │   │
│  │   │     AES Key ──► Encrypt Secret ──► { blob, iv, tag } │  │   │
│  │   │              ◄── Decrypt Secret ◄── { blob, iv, tag } │  │   │
│  │   └───────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────┬──────────────────────────────┘   │
│                                  │ HTTPS + WSS                      │
└──────────────────────────────────┼─────────────────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │          RENDER (Node.js Server)                  │
          │                                                   │
          │  ┌─────────────┐    ┌────────────────────────┐   │
          │  │  Express.js  │    │      Socket.io          │   │
          │  │             │    │  JWT Auth Middleware     │   │
          │  │  REST API   │    │  User Private Rooms      │   │
          │  │             │    │  Event: vault:created    │   │
          │  │  /api/auth  │    │  Event: vault:deleted    │   │
          │  │  /api/vault │    │  Event: vault:updated    │   │
          │  │  /api/apikeys    │  Event: audit:new        │   │
          │  │  /api/audit │    └────────────────────────┘   │
          │  └──────┬──────┘                                  │
          │         │                                          │
          │  ┌──────▼──────────────────────────────────────┐  │
          │  │              Middleware Stack                 │  │
          │  │  helmet → cors → rate-limit → slow-down      │  │
          │  │  → cookie-parser → jwt verify → controller   │  │
          │  └──────┬──────────────────────────────────────┘  │
          └─────────┼──────────────────────────────────────────┘
                    │
          ┌─────────▼──────────────────────────┐
          │      MongoDB Atlas (Free Tier)       │
          │                                      │
          │  Collections:                        │
          │  ├── users        (auth + salt)      │
          │  ├── secrets      (encrypted blobs)  │
          │  ├── apikeys      (bcrypt hashes)    │
          │  └── auditlogs    (TTL: 90 days)     │
          └──────────────────────────────────────┘
```

### Request Flow: Storing a Secret

```
User types password "hunter2"
        │
        ▼
Browser: PBKDF2(masterPassword, encryptionSalt, 100000 iter) → AES Key
        │
        ▼
Browser: AES-256-GCM Encrypt({ username, password, url, notes }) 
        │
        ▼
Browser sends: POST /api/vault { name, category, encryptedData, iv, authTag }
        │                               ↑ pure gibberish to the server
        ▼
Server: validates JWT, saves to MongoDB — never attempts to decrypt
        │
        ▼
MongoDB stores: { encryptedData: "x7kP9mQ...", iv: "a3f8...", authTag: "9c2d..." }
```

### Request Flow: Revealing a Secret

```
User clicks "Reveal"
        │
        ▼
Browser: GET /api/vault/:id → receives { encryptedData, iv, authTag }
        │
        ▼
Browser: AES-256-GCM Decrypt(encryptedData, iv, authTag, AES Key)
        │
        ▼
Browser displays: { username: "user@gmail.com", password: "hunter2" }
                                                                ↑
                              This plaintext NEVER leaves the browser
```

---

## 🔐 How Encryption Works

### Key Derivation (PBKDF2)

```javascript
// Runs ENTIRELY in browser — AES key never transmitted
const aesKey = await window.crypto.subtle.deriveKey(
  {
    name:       'PBKDF2',
    salt:       encryptionSalt,   // 32-byte random salt from server (unique per user)
    iterations: 100_000,          // NIST recommended minimum
    hash:       'SHA-256',
  },
  keyMaterial,                    // derived from master password
  { name: 'AES-GCM', length: 256 },
  false,                          // NOT extractable — cannot be read from memory
  ['encrypt', 'decrypt']
);
```

### Encryption (AES-256-GCM)

```javascript
const iv       = crypto.getRandomValues(new Uint8Array(12));  // fresh 96-bit IV
const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  aesKey,
  encode(JSON.stringify({ username, password, url, notes }))
);
// Output includes 128-bit authentication tag (last 16 bytes)
// → guarantees ciphertext integrity — detects any tampering
```

### Why AES-256-GCM?

| Property | Benefit |
|---|---|
| **256-bit key** | 2²⁵⁶ possible keys — brute force is computationally impossible |
| **GCM mode** | Authenticated encryption — detects if ciphertext was tampered with |
| **Random IV** | Same plaintext encrypts to different ciphertext every time |
| **Auth tag** | 128-bit MAC ensures data integrity on decryption |
| **Web Crypto API** | Native browser crypto — no third-party library needed, no supply chain risk |

---

## 📡 API Reference

Base URL: `https://securevault-api-tm97.onrender.com/api`

All protected endpoints require: `Authorization: Bearer <access_token>`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | None | Register new account |
| `GET` | `/auth/verify-email?token=xxx` | None | Verify email address |
| `POST` | `/auth/login` | None | Login (returns JWT or 2FA prompt) |
| `POST` | `/auth/2fa/setup` | JWT | Get QR code for 2FA setup |
| `POST` | `/auth/2fa/enable` | JWT | Confirm 2FA with TOTP code |
| `POST` | `/auth/2fa/verify` | None | Complete login with 2FA code |
| `POST` | `/auth/2fa/disable` | JWT | Disable 2FA |
| `POST` | `/auth/refresh` | Cookie | Get new access token |
| `POST` | `/auth/logout` | JWT | Logout + clear refresh token |
| `GET` | `/auth/me` | JWT | Get current user profile |

### Vault

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/vault` | JWT / ApiKey | List all secrets (metadata only) |
| `GET` | `/vault/:id` | JWT / ApiKey | Get single secret with encrypted blob |
| `POST` | `/vault` | JWT / ApiKey | Store new encrypted secret |
| `PUT` | `/vault/:id` | JWT / ApiKey | Update secret |
| `DELETE` | `/vault/:id` | JWT / ApiKey | Delete secret |

**Query params for GET /vault:**
- `category` — filter by `login` | `card` | `note` | `api_key`
- `search` — filter by name (case-insensitive regex)
- `page` — pagination page (default: 1)
- `limit` — results per page (default: 50)

### API Keys

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/apikeys` | JWT | Create new API key (raw key shown once) |
| `GET` | `/apikeys` | JWT | List all active API keys |
| `DELETE` | `/apikeys/:id` | JWT | Revoke API key |

### Audit Log

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/audit` | JWT | Fetch paginated audit log |

**Query params:** `action`, `page`, `limit`

### Example: Using API Key Authentication

```bash
# Create an API key (requires JWT login first)
curl -X POST https://securevault-api.onrender.com/api/apikeys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My CLI Script", "permissions": ["read"]}'

# Use the API key to read vault (no JWT needed)
curl https://securevault-api.onrender.com/api/vault \
  -H "Authorization: ApiKey sv_live_YOUR_KEY_HERE"
```

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "user": { "email": "user@example.com", ... },
    "encryptionSalt": "a3f8c2e1..."
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🛡 Security Model

### Threat Model

| Threat | Mitigation |
|---|---|
| **Database breach** | AES-256-GCM encrypted blobs — zero plaintext exposure |
| **Server compromise** | Zero-knowledge — server never holds decryption keys |
| **MITM attack** | HTTPS enforced; HSTS headers set |
| **Brute force login** | 10 attempts/15 min; progressive slow-down after 5 |
| **Stolen access token** | 15-minute expiry; refresh token in HttpOnly cookie |
| **Stolen refresh token** | Per-device token rotation; revoke on logout |
| **CSRF** | `SameSite=Strict` in development; JWT in header for API |
| **XSS** | JWT not in localStorage; HttpOnly cookie; CSP via Helmet |
| **API key theft** | Bcrypt-hashed storage — raw key unrecoverable after creation |
| **Weak master password** | PBKDF2 with 100K iterations makes dictionary attacks slow |
| **Ciphertext tampering** | GCM auth tag rejects tampered ciphertext |
| **Enumeration** | Same error message for wrong email and wrong password |

### Security Headers (via Helmet)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin
```

### Rate Limiting

```
Auth endpoints:    10 requests / 15 minutes (per IP)
API endpoints:     100 requests / 1 minute (per IP)  
Slow-down:         +500ms per request after 5 failed auth attempts
```

---

## 📊 Performance & Capacity

| Metric | Value |
|---|---|
| **Max secrets per user** | ~50,000 (MongoDB document limit + index performance) |
| **Concurrent WebSocket connections** | ~100 (Render free tier memory limit) |
| **Cross-tab sync latency** | < 2 seconds |
| **Auth rate limit** | 10 requests / 15 min per IP |
| **API rate limit** | 100 requests / min per IP |
| **JWT access token expiry** | 15 minutes |
| **JWT refresh token expiry** | 7 days |
| **Concurrent sessions per user** | 5 devices |
| **Audit log retention** | 90 days (MongoDB TTL index) |
| **PBKDF2 iterations** | 100,000 (NIST minimum) |
| **bcrypt cost factor** | 12 (~300ms per hash) |
| **API key permissions** | 3 tiers (read / write / delete) |
| **Audit event types** | 15 |
| **React Query stale time** | 1 minute |
| **React Query GC time** | 5 minutes |

---

## 👤 Author

<div align="center">

**Sourabh Barwal**
*B.Tech Computer Science — IIIT Nagpur (2023–2027)*

[![Email](https://img.shields.io/badge/Email-sourabh17barwal%40gmail.com-7EFFF5?style=for-the-badge&logo=gmail&logoColor=black)](mailto:sourabh17barwal@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sourabh_Barwal-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sourabh-barwal/)
[![GitHub](https://img.shields.io/badge/GitHub-sourabhbarwal-white?style=for-the-badge&logo=github&logoColor=black)](https://github.com/sourabhbarwal)

</div>
