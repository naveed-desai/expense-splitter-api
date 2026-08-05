const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = Joi.object(schema).validate(req, { allowUnknown: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Please enter correct details before submitting", error
    });
  }

  next();
};

module.exports = validate;
