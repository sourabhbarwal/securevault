// const { Server } = require('socket.io');
// const { verifyAccessToken } = require('../services/token.service');

// let io;

// const initSocket = (httpServer) => {
//   io = new Server(httpServer, {
//     cors: {
//       origin: process.env.CLIENT_URL,
//       methods: ['GET', 'POST'],
//       credentials: true,
//     },
//   });

//   // ── Auth middleware — verify JWT on connection ──────────
//   io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error('No token provided'));
//     }
//     try {
//       const decoded = verifyAccessToken(token);
//       socket.userId = decoded.userId;
//       next();
//     } catch {
//       next(new Error('Invalid token'));
//     }
//   });

//   // ── Connection handler ─────────────────────────────────
//   io.on('connection', (socket) => {
//     console.log(`⚡  Socket connected: user=${socket.userId}`);

//     // Each user joins their own private room
//     socket.join(`user:${socket.userId}`);

//     socket.on('disconnect', () => {
//       console.log(`🔌  Socket disconnected: user=${socket.userId}`);
//     });
//   });

//   console.log('✅  Socket.io initialized');
//   return io;
// };

// // ── Emit event to a specific user ──────────────────────────
// // Call this from controllers after mutations
// const emitToUser = (userId, event, data) => {
//   if (io) {
//     io.to(`user:${userId}`).emit(event, data);
//   }
// };

// module.exports = { initSocket, emitToUser };

const { Server } = require('socket.io');
const { verifyAccessToken } = require('../services/token.service');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    // ── Socket.io has its own CORS — separate from Express ──
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.CLIENT_URL,        // your Vercel URL
      ].filter(Boolean),
      methods:     ['GET', 'POST'],
      credentials: true,
    },
    // ── Allow both transports — polling first, then upgrade ─
    transports: ['polling', 'websocket'],
    // ── Ping settings to detect dead connections ─────────────
    pingTimeout:  20000,
    pingInterval: 25000,
  });

  // ── JWT auth middleware ────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('AUTH_MISSING'));
    }

    try {
      const decoded   = verifyAccessToken(token);
      socket.userId   = decoded.userId;
      next();
    } catch (err) {
      console.error('Socket auth failed:', err.message);
      return next(new Error('AUTH_INVALID'));
    }
  });

  // ── Connection handler ─────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`⚡  Socket connected  | user: ${socket.userId} | transport: ${socket.conn.transport.name}`);

    // Each user joins their private room
    socket.join(`user:${socket.userId}`);

    // Confirm connection to client
    socket.emit('connected', { userId: socket.userId });

    socket.on('disconnect', (reason) => {
      console.log(`🔌  Socket disconnected | user: ${socket.userId} | reason: ${reason}`);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);
    });
  });

  console.log('✅  Socket.io initialized');
  return io;
};

// ── Emit to a specific user's private room ─────────────────
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId.toString()}`).emit(event, data);
  }
};

module.exports = { initSocket, emitToUser };