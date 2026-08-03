const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

/**
 * Start Server Procedure:
 * 1. Connect to MySQL Database & sync Sequelize models
 * 2. Bind Express app to designated port
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
