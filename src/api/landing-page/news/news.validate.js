const Joi = require('joi');

const validateNewId = Joi.number().required();

const validateCreateComment = Joi.object({
  content: Joi.string().required(),
  newsId: Joi.number().required(),
});

const validateUpdateComment = Joi.object({
  content: Joi.string().required(),
  newsId: Joi.number().required(),
  id: Joi.number().required(),
});

const validateDeleteComment = Joi.object({
  newsId: Joi.number().required(),
  id: Joi.number().required(),
});

module.exports = {
  validateNewId,
  validateCreateComment,
  validateUpdateComment,
  validateDeleteComment,
};
