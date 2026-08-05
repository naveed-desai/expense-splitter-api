const logger = require('../utils/logger');

const getHealthStatus = (req, res) => {
  logger.info('API request received: GET /health');
  logger.info('Successful response: Server is running');
  return res.status(200).json({
    success: true,
    message: "Server is running"
  });
};

module.exports = {
  getHealthStatus
};
