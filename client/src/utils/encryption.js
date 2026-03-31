/**
 * ZERO-KNOWLEDGE ENCRYPTION
 *
 * Flow:
 * 1. User logs in → server returns encryptionSalt
 * 2. Browser runs: PBKDF2(masterPassword + encryptionSalt) → 256-bit AES key
 * 3. AES key lives ONLY in browser memory — never sent anywhere
 * 4. Every secret is encrypted with AES-256-GCM before hitting the server
 * 5. Server stores encrypted blobs it mathematically cannot read
 */

const ITERATIONS = 100_000;  // NIST minimum for PBKDF2

// ── Derive AES key from master password ──────────────────
export const deriveKey = async (masterPassword, saltHex) => {
  const encoder  = new TextEncoder();
  const saltBytes = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', encoder.encode(masterPassword), { name: 'PBKDF2' }, false, ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,           // NOT extractable — key cannot be read from memory
    ['encrypt', 'decrypt']
  );
};

// ── Encrypt a plain object ────────────────────────────────
export const encryptSecret = async (secretData, aesKey) => {
  const encoder = new TextEncoder();
  const iv      = window.crypto.getRandomValues(new Uint8Array(12));  // 96-bit IV

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, aesKey,
    encoder.encode(JSON.stringify(secretData))
  );

  const full      = new Uint8Array(ciphertextBuffer);
  const ciphertext = full.slice(0, -16);
  const authTag   = full.slice(-16);

  return {
    encryptedData: btoa(String.fromCharCode(...ciphertext)),
    iv:            [...iv].map(b => b.toString(16).padStart(2,'0')).join(''),
    authTag:       [...authTag].map(b => b.toString(16).padStart(2,'0')).join(''),
  };
};

// ── Decrypt a stored secret ───────────────────────────────
export const decryptSecret = async ({ encryptedData, iv, authTag }, aesKey) => {
  const toBytes = hex => new Uint8Array(hex.match(/.{2}/g).map(b => parseInt(b,16)));
  const cipher  = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const tag     = toBytes(authTag);
  const ivBytes = toBytes(iv);

  const full = new Uint8Array(cipher.length + tag.length);
  full.set(cipher); full.set(tag, cipher.length);

  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes }, aesKey, full
  );

  return JSON.parse(new TextDecoder().decode(plainBuffer));
};