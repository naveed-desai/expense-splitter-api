const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/health.controller');

/**
 * Health check route definition
 * GET /api/health
 */
router.get('/', getHealthStatus);

module.exports = router;
