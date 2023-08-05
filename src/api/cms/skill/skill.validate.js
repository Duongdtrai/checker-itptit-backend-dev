const Joi = require('joi');

const validateSkillId = Joi.number().required();
const validateCreateSkill = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  validateSkillId,
  validateCreateSkill,
};
