import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io }         from 'socket.io-client';
import { useAuth }    from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const SocketContext = createContext(null);

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

export function SocketProvider({ children }) {
  const { user, accessTokenRef }      = useAuth();
  const qc            = useQueryClient();
  const socketRef     = useRef(null);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState('—');

  useEffect(() => {

    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
        setTransport('—');
      }
      return;
    }

    // Get token from axios defaults
    const token = accessTokenRef.current;
    if (!token) {
      console.warn('Socket: no access token available yet');
      return;
    }

    if (socketRef.current?.connected) return;

    const socketUrl = getSocketUrl();
    console.log('⚡ Connecting socket to:', socketUrl);

    const socket = io( socketUrl, {
        auth:        { token},
        transports:  ['polling','websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay:    2000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
      }
    );

    socket.on('connect', () => { 
      console.log(`⚡ Socket connected | id: ${socket.id} | transport: ${socket.conn.transport.name}`);
      setConnected(true);
      setTransport(socket.conn.transport.name);
    });

    socket.on('connect', () => {
      socket.conn.on('upgrade', (newTransport) => {
        console.log(`⬆️ Transport upgraded to: ${newTransport.name}`);
        setTransport(newTransport.name);
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${reason}`);
      setConnected(false);
      setTransport('—');
    });

    socket.on('connect_error', (err) => {
      // Log but don't spam — reconnection is automatic
      console.warn(`Socket connect_error: ${err.message}`);
      setConnected(false);
    });

    // ── Server confirmation ───────────────────────────────────
    socket.on('connected', ({ userId }) => {
      console.log(`🔐 Socket authenticated for user: ${userId}`);
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
      console.log('🧹 Cleaning up socket');
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user, qc]);

  return (
    <SocketContext.Provider value={{ connected, transport, socket: socketRef.current, }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);