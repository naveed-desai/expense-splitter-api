const { expenseService } = require('../services');

const addExpense = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { description, amount, paidByMemberId, paidBy, splitMemberIds, date } = req.body;

    if (typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Expense description is required'
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid positive expense amount is required'
      });
    }

    if (!paidByMemberId && (typeof paidBy !== 'string' || !paidBy.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Payer member ID or name is required'
      });
    }

    const createdExpense = await expenseService.addExpense({
      groupId,
      description,
      amount,
      paidByMemberId,
      paidBy,
      splitMemberIds,
      date
    });

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: createdExpense
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const createSettlement = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { payerMemberId, payeeMemberId, payerName, payeeName, amount } = req.body;

    const settlementExpense = await expenseService.recordSettlement({
      groupId,
      payerMemberId,
      payeeMemberId,
      payerName,
      payeeName,
      amount
    });

    return res.status(201).json({
      success: true,
      message: `Settlement payment of ₹${parseFloat(amount).toFixed(2)} recorded successfully`,
      data: settlementExpense
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const getGroupExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const expenses = await expenseService.getGroupExpenses(groupId);

    return res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  createSettlement,
  getGroupExpenses
};
