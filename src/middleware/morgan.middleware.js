const morgan = require('morgan');
const logger = require('../utils/logger');

// Stream object to route Morgan log messages to Winston logger
const stream = {
  write: (message) => logger.info(message.trim()),
};

// Custom format for Morgan HTTP request logging
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

module.exports = morganMiddleware;
