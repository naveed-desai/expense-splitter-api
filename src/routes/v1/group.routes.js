const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.controller');
const expenseController = require('../../controllers/expense.controller');
const validate = require('../../middleware/validate.middleware');
const {
  groupValidation: { createGroup, getGroupById, addMemberToGroup, getAvailableUsers },
  expenseValidation: { addExpense, getGroupExpenses, createSettlement }
} = require('../../validations');

// Group routes
router.post('/', validate(createGroup), groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:id', validate(getGroupById), groupController.getGroupById);

// Expense routes
router.post('/:groupId/expenses', validate(addExpense), expenseController.addExpense);
router.get('/:groupId/expenses', validate(getGroupExpenses), expenseController.getGroupExpenses);

// Member routes 
router.post('/:groupId/members', validate(addMemberToGroup), groupController.addMemberToGroup);
router.get('/:groupId/available-users', validate(getAvailableUsers), groupController.getAvailableUsers);

// Settlement routes
router.post('/:groupId/settlements', validate(createSettlement), expenseController.createSettlement);
router.get('/:groupId/settlements', validate(getGroupExpenses), expenseController.getGroupExpenses);

module.exports = router;
