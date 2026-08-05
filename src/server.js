const app = require('./app');
const { connectDB } = require('./connections/mongodb');
const envConfig = require('./config/env.config');
const logger = require('./utils/logger');

const PORT = envConfig.port;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.warn('Server starting without active MongoDB connection.');
  }

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
