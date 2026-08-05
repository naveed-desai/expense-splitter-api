const mongoose = require('mongoose');
const envConfig = require('../config/env.config');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(envConfig.mongoUri);
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.log(`Unable to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = {
  mongoose,
  connectDB
};
