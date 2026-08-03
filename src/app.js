const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const healthRoutes = require('./routes/health.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Enable JSON Body Parsing
app.use(express.json());


// Health Check API Route
app.use('/api/health', healthRoutes);

// Catch-all handler for undefined 404 routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
