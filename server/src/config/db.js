const dns      = require('dns');
const mongoose = require('mongoose');

// Force Node.js to use Google DNS — required for reliable mongodb+srv:// SRV resolution.
// Some ISP/system DNS servers block or fail on SRV record queries.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('🔌  MongoDB Disconnected');
};

module.exports = { connectDB, disconnectDB };