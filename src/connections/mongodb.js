const mongoose = require('mongoose');
const envConfig = require('../config/env.config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    logger.info('Connecting to MongoDB database...');
    await mongoose.connect(envConfig.mongoUri);
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error(`Unable to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = {
  mongoose,
  connectDB
};
