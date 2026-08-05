const Joi = require('joi');

const createGroup = {
  body: Joi.object().keys({
    name: Joi.string().trim().required().messages({
      '*': 'Group name is required'
    }),
    description: Joi.string().trim().allow('').optional()
  })
};

const getGroupById = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

const addMemberToGroup = {
  params: Joi.object().keys({
    groupId: Joi.string().hex().length(24).required()
  }),
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).allow('', null).optional(),
    name: Joi.string().trim().allow('', null).optional()
  })
};

const getAvailableUsers = {
  params: Joi.object().keys({
    groupId: Joi.string().hex().length(24).required()
  })
};

module.exports = {
  createGroup,
  getGroupById,
  addMemberToGroup,
  getAvailableUsers
};
