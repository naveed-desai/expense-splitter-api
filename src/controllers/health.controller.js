/**
 * Health Controller
 * Handles status checks to verify backend API operational readiness.
 */

/**
 * GET /api/health
 * Response: { "success": true, "message": "Server is running" }
 */
const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running"
  });
};

module.exports = {
  getHealthStatus
};
