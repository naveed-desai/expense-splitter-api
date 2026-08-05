const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`Unhandled error: ${message}`, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    message,
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
