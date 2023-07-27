const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./band.constant');

module.exports = {
  getBands: async (req, res) => {
    try {
      const data = await dbModels.bandsModel.findAll({
        where: {
          isDeleted: 0,
        },
        order: [['priority', 'ASC']],
      });

      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
        bands: data,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  getBandById: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await dbModels.bandsModel.findByPk(id, {
        where: { isDeleted: false },
      });
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
        band: data,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  createBand: async (req, res) => {
    try {
      const { name, priority } = req.body;
      const newBand = await dbModels.bandsModel.create({ name, priority });
      return res.status(201).json({
        success: true,
        message: 'Band created!',
        band: newBand,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  updateBand: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, priority } = req.body;
      await dbModels.bandsModel.update({ name, priority }, { where: { id } });
      const band = await dbModels.bandsModel.findByPk(id);
      return res.status(201).json({
        band,
        success: true,
        message: 'Band updated!',
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  deleteBand: async (req, res) => {
    try {
      const id = req.params.id;
      await dbModels.bandsModel.update({ isDeleted: true }, { where: { id } });
      return res.status(201).json({
        success: true,
        message: 'Band deleted!',
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
