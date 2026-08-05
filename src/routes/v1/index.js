const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const groupRoutes = require('./group.routes');
const userRoutes = require('./user.routes');

router.use('/health', healthRoutes);
router.use('/groups', groupRoutes);
router.use('/users', userRoutes);

module.exports = router;
