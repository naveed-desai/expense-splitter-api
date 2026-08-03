const { sequelize } = require('../config/database');

/**
 * Centralized Models Registry (Phase 1 Placeholder)
 * Future database models (User, Group, Expense, etc.) will be defined
 * and exported from here in upcoming phases.
 */
const db = {
  sequelize,
};

module.exports = db;
