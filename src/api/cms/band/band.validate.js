const Joi = require('joi');

const validateBandId = Joi.number().required();

const validateCreateBand = Joi.object({
  name: Joi.string().required(),
  priority: Joi.number().required(),
});
module.exports = {
  validateBandId,
  validateCreateBand,
};
