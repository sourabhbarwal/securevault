const required = [
  'PORT',
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES',
  'JWT_REFRESH_EXPIRES',
  'CLIENT_URL',
];

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌  Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log('✅  Environment variables validated');
};

module.exports = validateEnv;