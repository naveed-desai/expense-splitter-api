const mongoose = require('mongoose');
const User = require('./user.model');
const Group = require('./group.model');
const Expense = require('./expense.model');

module.exports = {
  mongoose,
  User,
  Group,
  Expense
};
