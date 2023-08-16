const Joi = require('joi');
/**
 * @Note use library joi to validate
 */
const validateCmsAuthenticationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(1).max(32).required(),
});

const validateCmsImportFile = Joi.object({
  email: Joi.string()
    .pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
    .required(),
  username: Joi.string().required(),
  birthday: Joi.string().required(),
  fullName: Joi.string().required(),
  gender: Joi.number().valid(1, 2).required(),
});

const validateChangePassword = Joi.object({
  password: Joi.string().min(1).max(32).required(),
  newPassword: Joi.string().min(1).max(32).required(),
});

const validateChangeUser = Joi.object({
  email: Joi.string()
    .pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
    .required(),
  username: Joi.string().required(),
  fullName: Joi.string().required(),
  gender: Joi.number().valid(1, 2).required(),
  birthday: Joi.string().required(),
  hometown: Joi.string().allow(null, ''),
  major: Joi.string().required(),
  job: Joi.string().allow(null, ''),
  course: Joi.string().required(),
  team: Joi.number().valid(1, 2, 3, 4, 5).required(),
  hobby: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  achievements: Joi.string().allow(null, ''),
  quote: Joi.string().allow(null, ''),
  listSkills: Joi.array().allow(null, ''),
  phoneNumber: Joi.string().allow(null, ''),
});

const validateEmail = Joi.string().email().required();
const validatePassword = Joi.string().min(1).max(32).required();
const validateUserId = Joi.number().required()

module.exports = {
  validateCmsAuthenticationSchema,
  validateChangePassword,
  validateCmsImportFile,
  validateEmail,
  validateChangeUser,
  validatePassword,
  validateUserId
};
