// require('dotenv').config();
// const validateEnv           = require('./src/config/env');
// const { connectDB, disconnectDB } = require('./src/config/db');
// const app                   = require('./src/app');

// validateEnv();

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await connectDB();

//   const server = app.listen(PORT, () => {
//     console.log(`🚀  Server running → http://localhost:${PORT}`);
//     console.log(`🏥  Health check  → http://localhost:${PORT}/health`);
//   });

//   const shutdown = async (signal) => {
//     console.log(`\n⚠️   ${signal} received. Shutting down...`);
//     server.close(async () => {
//       await disconnectDB();
//       console.log('✅  Server closed');
//       process.exit(0);
//     });
//   };

//   process.on('SIGTERM', () => shutdown('SIGTERM'));
//   process.on('SIGINT',  () => shutdown('SIGINT'));
//   process.on('unhandledRejection', (err) => {
//     console.error('💥  Unhandled Rejection:', err.message);
//     shutdown('unhandledRejection');
//   });
// };

// startServer();

require('dotenv').config();
const http      = require('http');
const validateEnv           = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');
const app                   = require('./src/app');
const { initSocket }        = require('./src/config/socket');

validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Attach Socket.io to HTTP server
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀  Server running → http://localhost:${PORT}`);
    console.log(`⚡  Socket.io ready`);
    console.log(`🏥  Health check  → http://localhost:${PORT}/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n⚠️   ${signal} received. Shutting down...`);
    httpServer.close(async () => {
      await disconnectDB();
      console.log('✅  Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    console.error('💥  Unhandled Rejection:', err.message);
    shutdown('unhandledRejection');
  });
};

startServer();