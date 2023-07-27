const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./period.constant');

module.exports = {
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const period = await dbModels.periodsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        period,
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
      const { started_at, ended_at } = req.body;
      const period = await dbModels.periodsModel.create({
        started_at,
        ended_at,
      });
      return res.status(statusCode[200].code).json({
        period,
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
      const { started_at, ended_at } = req.body;
      await dbModels.periodsModel.update(
        { started_at, ended_at },
        { where: { id } }
      );
      const period = await dbModels.periodsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        period,
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
