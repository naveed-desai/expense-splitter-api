const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 8000,
  mongoUri: process.env.MONGO_URI
};
