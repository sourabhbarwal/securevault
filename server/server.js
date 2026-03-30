require('dotenv').config();
const validateEnv           = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');
const app                   = require('./src/app');

validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀  Server running → http://localhost:${PORT}`);
    console.log(`🏥  Health check  → http://localhost:${PORT}/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n⚠️   ${signal} received. Shutting down...`);
    server.close(async () => {
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