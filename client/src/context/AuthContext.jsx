import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { deriveKey } from '../utils/encryption';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [aesKey,  setAesKey]  = useState(null);
  const [loading, setLoading] = useState(true);  // start true — we check session first

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post('/auth/refresh');

        if (data?.data?.accessToken) {
          axios.defaults.headers.common['Authorization'] =
            `Bearer ${data.data.accessToken}`;

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

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    const key = await deriveKey(password, encryptionSalt);
    setAesKey(key);
    setUser(userData);

    return { success: true };
  }, []);

  const completeLogin = useCallback(async (
    accessToken, userData, encryptionSalt, masterPassword
  ) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
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
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setAesKey(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, aesKey, loading,
      login, logout, completeLogin, setUser,
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