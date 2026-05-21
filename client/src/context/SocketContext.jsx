import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io }         from 'socket.io-client';
import { useAuth }    from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user }      = useAuth();
  const qc            = useQueryClient();
  const socketRef     = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Get access token from axios defaults
    const token = document.cookie; // fallback
    const authHeader = window._axiosToken; // set by axiosInstance

    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Get token from axios defaults
    const axiosToken = window.__svToken;
    if (!axiosToken) return;

    const socket = io(
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
      {
        auth:        { token: axiosToken },
        transports:  ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay:    1000,
      }
    );

    socket.on('connect', () => {
      console.log('⚡ Socket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setConnected(false);
    });

    // ── Real-time vault events ────────────────────────────
    socket.on('vault:created', () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
    });
    socket.on('vault:deleted', () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
    });
    socket.on('vault:updated', () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
    });

    // ── Real-time audit log ───────────────────────────────
    socket.on('audit:new', (entry) => {
      // Prepend new log entry to cached data
      qc.setQueryData(['auditLogs', 1], (old) => {
        if (!old) return old;
        return {
          ...old,
          logs: [entry, ...(old.logs || [])].slice(0, 20),
        };
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, qc]);

  return (
    <SocketContext.Provider value={{ connected, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);