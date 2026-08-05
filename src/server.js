const app = require('./app');
const { connectDB } = require('./connections/mongodb');
const envConfig = require('./config/env.config');

const PORT = envConfig.port;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.log('Server starting without active MongoDB connection.');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
