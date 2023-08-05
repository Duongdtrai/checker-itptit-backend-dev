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
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  birthday: Joi.string().required(),
  course: Joi.string().required(),
  team: Joi.number().valid(1, 2, 3, 4, 5).required(),
});

const validateChangePassword = Joi.object({
  password: Joi.string().min(1).max(32).required(),
  newPassword: Joi.string().min(1).max(32).required(),
});

const validateCmsCreateMember = Joi.object({
  email: Joi.string()
    .pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
    .required(),
  username: Joi.string().required(),
  fullName: Joi.string().required(),
  gender: Joi.number().valid(1, 2).required(),
  birthday: Joi.string().required(),
  image: Joi.string().allow(null, ''),
  hometown: Joi.string().allow(null, ''),
  major: Joi.string().required(),
  job: Joi.string().allow(null, ''),
  course: Joi.string().required(),
  team: Joi.number().valid(1, 2, 3, 4, 5).required(),
  hobby: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  achievements: Joi.string().allow(null, ''),
  quote: Joi.string().allow(null, ''),
  isFamous: Joi.boolean().required(),
  listSkills: Joi.array().allow(null, ''),
  listBands: Joi.array().allow(null, ''),
  timeOutstanding: Joi.number().allow(null, ''),
});

const validateChangeUser = Joi.object({
  userId: Joi.number().required(),
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
  isFamous: Joi.boolean().required(),
  listSkills: Joi.array().allow(null, ''),
  listBands: Joi.array().allow(null, ''),
  timeOutstanding: Joi.string().allow(null, ''),
  checkOutstanding: Joi.boolean().allow(null, ''),
});

const validateEmail = Joi.string().email().required();
const validatePassword = Joi.string().min(1).max(32).required();

module.exports = {
  validateCmsAuthenticationSchema,
  validateChangePassword,
  validateCmsCreateMember,
  validateCmsImportFile,
  validateEmail,
  validateChangeUser,
  validatePassword,
};
