const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./news.constants');

module.exports = {
  create: async (req, res) => {
    try {
      const { content, organizationId, eventId, views } = req.body;
      const news = await dbModels.newsModel.create({
        content,
        organizationId,
        eventId,
        views,
      });
      return res.status(statusCode[200].code).json({
        news,
        success: true,
        message: statusCode[200].message,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { content, organizationId, eventId, views } = req.body;
      await dbModels.thumbnailsModel.update(
        { content, organizationId, eventId, views },
        { where: { id } }
      );
      const news = await dbModels.newsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        news,
        success: true,
        message: statusCode[200].message,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      await dbModels.thumbnailsModel.update(
        { isDeleted: true },
        { where: { id } }
      );
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const news = await dbModels.newsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        news,
        success: true,
        message: statusCode[200].message,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const news = await dbModels.newsModel.findAll({});
      return res.status(statusCode[200].code).json({
        news,
        success: true,
        message: statusCode[200].message,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  getNewsComments: async (req, res) => {
    try {
      const id = req.params.id;
      const comments = await dbModels.newsCommentsModel.findAll({
        where: { newsId: id, isDeleted: false },
        include: [{ model: dbModels.membersModel, as: 'member' }],
      });
      return res.status(statusCode[200].code).json({
        comments,
        success: true,
        message: statusCode[200].message,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },
};
