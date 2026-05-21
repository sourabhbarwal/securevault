import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from '../api/axiosInstance';
import { deriveKey } from '../utils/encryption';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [aesKey,  setAesKey]  = useState(null);
  // const [token,   setToken]   = useState(null);   // raw JWT for SSE EventSource
  const [loading, setLoading] = useState(true);

  // Using a ref avoids re-render cycles when token changes
  const accessTokenRef = useRef(null);
  useEffect(() => {
    window.__authRef = accessTokenRef;
    return () => { delete window.__authRef; };
  }, []);
  // ── Helper: set token in both axios defaults and ref ────────
  const setToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      accessTokenRef.current = token;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      accessTokenRef.current = null;
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post('/auth/refresh');

        if (data?.data?.accessToken) {
          setToken(data.data.accessToken);
          const meResponse = await axios.get('/auth/me');
          setUser(meResponse.data.data.user);
        }
      } catch {
        // 401 here = no refresh token cookie = user not logged in.
        // This is NORMAL on first visit. Silently do nothing.
        // Do NOT log this error — it is expected.
      } finally {
        // This ALWAYS runs — removes the loading screen
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });

    if (data.data?.requires2FA) {
      return { requires2FA: true, userId: data.data.userId };
    }

    const { accessToken, user: userData, encryptionSalt } = data.data;
    setToken(accessToken);
    const key = await deriveKey(password, encryptionSalt);
    setAesKey(key);
    setUser(userData);
    return { success: true };
  }, []);

  const completeLogin = useCallback(async (
    accessToken, userData, encryptionSalt, masterPassword
  ) => {
    setToken(accessToken);
    const key = await deriveKey(masterPassword, encryptionSalt);
    setAesKey(key);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout');
    } catch {
      // Logout failed on server side — still clear client state
    }
    setUser(null);
    setAesKey(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, aesKey, loading,
      login, logout, completeLogin, setUser,
      accessTokenRef,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};