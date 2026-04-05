import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { deriveKey } from '../utils/encryption';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);

  // ⚠️  The AES key lives ONLY in memory — never in localStorage/sessionStorage.
  // If the user refreshes, they must log in again to re-derive it.
  // This IS the zero-knowledge guarantee.
  const [aesKey,  setAesKey]  = useState(null);

  const [loading, setLoading] = useState(true);

  // ── On app start: try to restore session via refresh token cookie ──
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post('/auth/refresh');
        if (data.data?.accessToken) {
          // Set token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;

          // Fetch current user profile
          const meResponse = await axios.get('/auth/me');
          setUser(meResponse.data.data.user);

          // NOTE: aesKey is NOT restored here.
          // The user must log in (enter their password) to re-derive the AES key.
          // If aesKey is null, the vault list still works (metadata only).
          // Decryption of secret content requires the user to enter their password again.
        }
      } catch {
        // No valid refresh token — user needs to log in
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });

    // 2FA required — don't set tokens yet
    if (data.data?.requires2FA) {
      return { requires2FA: true, userId: data.data.userId };
    }

    const { accessToken, user: userData, encryptionSalt } = data.data;

    // Set bearer token for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // Derive AES key from master password + server-provided salt
    // This is the PBKDF2 step — takes ~1 second intentionally (brute-force protection)
    const key = await deriveKey(password, encryptionSalt);

    setAesKey(key);
    setUser(userData);

    return { success: true };
  }, []);

  // ── Complete login after 2FA verification ──────────────────────────
  const completeLogin = useCallback(async (accessToken, userData, encryptionSalt, masterPassword) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    const key = await deriveKey(masterPassword, encryptionSalt);
    setAesKey(key);
    setUser(userData);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout');
    } catch {
      // Even if server logout fails, clear client state
    }

    // Clear axios auth header
    delete axios.defaults.headers.common['Authorization'];

    // Clear state — AES key is wiped from memory
    setUser(null);
    setAesKey(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      aesKey,
      loading,
      login,
      logout,
      completeLogin,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};