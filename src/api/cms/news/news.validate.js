const Joi = require('joi');

const validateCreateNews = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  isPublic: Joi.boolean().required(),
  listSubject: Joi.array().allow(null),
});

const validateNewId = Joi.number().required();

const validateUpdateComment = Joi.object({
  content: Joi.string().required(),
  newsId: Joi.number().required(),
  id: Joi.number().required(),
});

const validateCreateComment = Joi.object({
  content: Joi.string().required(),
  newsId: Joi.number().required(),
});

const validateDeleteComment = Joi.object({
  newsId: Joi.number().required(),
  id: Joi.number().required(),
  memberId: Joi.number().required(),
});

module.exports = {
  validateCreateNews,
  validateNewId,
  validateUpdateComment,
  validateCreateComment,
  validateDeleteComment,
};
