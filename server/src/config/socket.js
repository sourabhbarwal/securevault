const { Server } = require('socket.io');
const { verifyAccessToken } = require('../services/token.service');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // ── Auth middleware — verify JWT on connection ──────────
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('No token provided'));
    }
    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection handler ─────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`⚡  Socket connected: user=${socket.userId}`);

    // Each user joins their own private room
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log(`🔌  Socket disconnected: user=${socket.userId}`);
    });
  });

  console.log('✅  Socket.io initialized');
  return io;
};

// ── Emit event to a specific user ──────────────────────────
// Call this from controllers after mutations
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

module.exports = { initSocket, emitToUser };