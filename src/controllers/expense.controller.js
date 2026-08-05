const { expenseService } = require('../services');
const logger = require('../utils/logger');

const addExpense = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    logger.info(`API request received: POST /groups/${groupId}/expenses`);
    const { description, amount, paidByMemberId, paidBy, splitMemberIds, date, splitBy } = req.body;
    console.log(splitBy)
    if (typeof description !== 'string' || !description.trim()) {
      logger.warn('Failed request: Expense description is required');
      return res.status(400).json({
        success: false,
        message: 'Expense description is required'
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      logger.warn('Failed request: A valid positive expense amount is required');
      return res.status(400).json({
        success: false,
        message: 'A valid positive expense amount is required'
      });
    }

    if (!paidByMemberId && (typeof paidBy !== 'string' || !paidBy.trim())) {
      logger.warn('Failed request: Payer member ID or name is required');
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
      date,
      splitBy
    });

    logger.info(`Successful response: Expense added successfully for group ${groupId}`);
    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: createdExpense
    });
  } catch (error) {
    logger.error(`Error in addExpense: ${error.message}`);
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
    logger.info(`API request received: POST /groups/${groupId}/settlements`);
    const { payerMemberId, payeeMemberId, payerName, payeeName, amount } = req.body;

    const settlementExpense = await expenseService.recordSettlement({
      groupId,
      payerMemberId,
      payeeMemberId,
      payerName,
      payeeName,
      amount
    });

    const successMsg = `Settlement payment of ₹${parseFloat(amount).toFixed(2)} recorded successfully`;
    logger.info(`Successful response: ${successMsg}`);
    return res.status(201).json({
      success: true,
      message: successMsg,
      data: settlementExpense
    });
  } catch (error) {
    logger.error(`Error in createSettlement: ${error.message}`);
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
    logger.info(`API request received: GET /groups/${groupId}/expenses`);

    const expenses = await expenseService.getGroupExpenses(groupId);

    logger.info(`Successful response: Expenses retrieved for group ${groupId}`);
    return res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    logger.error(`Error in getGroupExpenses: ${error.message}`);
    next(error);
  }
};

module.exports = {
  addExpense,
  createSettlement,
  getGroupExpenses
};
