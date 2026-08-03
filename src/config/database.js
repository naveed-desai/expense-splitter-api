const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Initialize Sequelize with MySQL connection details read from process.env
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'expense_splitter_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'rootpassword',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[SQL]: ${msg}`) : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

/**
 * Connect to the database and sync models automatically.
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[INFO] Database connected successfully via Sequelize ORM.');
    
    // Automatically sync models with MySQL database
    await sequelize.sync();
    console.log('[INFO] Database models synchronized automatically.');
  } catch (error) {
    console.error('[ERROR] Unable to connect to the database:', error.message);
  }
};

module.exports = {
  sequelize,
  connectDB
};
