const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running"
  });
};

module.exports = {
  getHealthStatus
};
