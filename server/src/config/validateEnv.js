const requiredEnvVars = ["MONGO_URL", "JWT_SECRET"];

const validateEnv = () => {
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      console.error(`❌ Missing required environment variable: ${key}`);
      process.exit(1);
    }
  });
};

module.exports = validateEnv;