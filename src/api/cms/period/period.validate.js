const Joi = require('joi');

const validateCreatePeriod = Joi.object({
  startedAt: Joi.string().required(),
  endedAt: Joi.string().required(),
});

const validatePeriodId = Joi.number().required();

module.exports = {
  validateCreatePeriod,
  validatePeriodId,
};
