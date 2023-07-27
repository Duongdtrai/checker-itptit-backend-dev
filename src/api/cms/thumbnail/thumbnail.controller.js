const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./thumbnail.constants');

module.exports = {
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const thumbnail = await dbModels.thumbnailsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        thumbnail,
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
  create: async (req, res) => {
    try {
      const { url, newsId } = req.body;
      const thumbnail = await dbModels.thumbnailsModel.create({
        url,
        newsId,
      });
      return res.status(statusCode[200].code).json({
        thumbnail,
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
      const { url, newsId } = req.body;
      await dbModels.thumbnailsModel.update({ url, newsId }, { where: { id } });
      const thumbnail = await dbModels.thumbnailsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        thumbnail,
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
};
