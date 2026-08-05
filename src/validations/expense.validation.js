const Joi = require('joi');

const addExpense = {
  params: Joi.object().keys({
    groupId: Joi.string().hex().length(24).required()
  }),
  body: Joi.object().keys({
    description: Joi.string().trim().required().messages({
      '*': 'Expense description is required'
    }),
    amount: Joi.number().positive().required().messages({
      '*': 'A valid positive expense amount is required'
    }),
    paidByMemberId: Joi.string().hex().length(24).allow('', null).optional(),
    paidBy: Joi.string().trim().allow('', null).optional(),
    category: Joi.string().trim().allow('', null).optional(),
    date: Joi.string().trim().allow('', null).optional()
  })
};

const createSettlement = {
  params: Joi.object().keys({
    groupId: Joi.string().hex().length(24).required()
  }),
  body: Joi.object().keys({
    payerMemberId: Joi.string().hex().length(24).allow('', null).optional(),
    payeeMemberId: Joi.string().hex().length(24).allow('', null).optional(),
    payerName: Joi.string().trim().allow('', null).optional(),
    payeeName: Joi.string().trim().allow('', null).optional(),
    amount: Joi.number().positive().required().messages({
      '*': 'A valid positive settlement amount is required'
    })
  })
};

const getGroupExpenses = {
  params: Joi.object().keys({
    groupId: Joi.string().hex().length(24).required()
  })
};

module.exports = {
  addExpense,
  createSettlement,
  getGroupExpenses
};
