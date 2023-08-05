const Joi = require('joi');

const validateCreateSubject = Joi.object({
  name: Joi.string().required(),
});
const validateSubjectId = Joi.number().required();

module.exports = {
  validateCreateSubject,
  validateSubjectId,
};
