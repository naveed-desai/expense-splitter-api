const mongoose = require('mongoose');
const User = require('./user.model');
const Group = require('./group.model');
const Expense = require('./expense.model');
const ExpenseSplit = require('./expenseSplit.model');

module.exports = {
  mongoose,
  User,
  Group,
  Expense,
  ExpenseSplit
};
