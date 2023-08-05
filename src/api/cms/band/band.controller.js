const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./band.response-status');
const { validateBandId, validateCreateBand } = require('./band.validate');
const { Op } = require('sequelize');

module.exports = {
  getBands: async (req, res) => {
    try {
      const { page, size } = req.query;
      let offset = 0;
      let limit = 10;
      if (page && size) {
        offset = (Number(page) - 1) * Number(size);
      }
      if (size) {
        limit = Number(size);
      }
      const data = await dbModels.bandsModel.findAndCountAll({
        offset,
        limit,
        attributes: ['id', 'name', 'priority', 'createdAt', 'updatedAt'],
        where: {
          isDeleted: 0,
        },
        order: [['priority', 'ASC']],
      });
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
        data,
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
      const id = await validateBandId.validateAsync(req.params.id);
      const dataExist = await dbModels.bandsModel.findOne({
        attributes: ['id', 'name', 'priority', 'createdAt', 'updatedAt'],
        where: { id, isDeleted: false },
      });
      if (!dataExist) {
        throw new Error('Band is not exist');
      }
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
        data: dataExist,
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
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { name, priority } = await validateCreateBand.validateAsync(
        req.body
      );
      const bandExist = await dbModels.bandsModel.findOne({
        where: {
          name,
        },
      });
      if (bandExist) {
        throw new Error('Band is exist');
      }
      const newBand = await dbModels.bandsModel.create({ name, priority });
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: 'Band created successfully!',
        data: newBand,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  updateBand: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const id = await validateBandId.validateAsync(req.params.id);
      const { name, priority } = await validateCreateBand.validateAsync(
        req.body
      );
      const bandExistName = await dbModels.bandsModel.findOne({
        where: {
          [Op.and]: [
            {
              name,
            },
            {
              isDeleted: 0,
            },
          ],
        },
      });
      if (bandExistName) {
        throw new Error('Name Band is exist');
      }
      const bandExistId = await dbModels.bandsModel.findOne({
        where: {
          id,
          isDeleted: 0,
        },
      });
      if (!bandExistId) {
        throw new Error('Band is not exist');
      }
      await dbModels.bandsModel.update(
        { name, priority },
        { where: { id }, transaction }
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: 'Band updated successfully!',
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  deleteBand: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const id = req.params.id;
      const bandExistId = await dbModels.bandsModel.findOne({
        where: {
          id,
          isDeleted: 0,
        },
      });
      if (!bandExistId) {
        throw new Error('Band is not exist');
      }
      await dbModels.bandsModel.update(
        { isDeleted: true },
        { where: { id }, transaction }
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: 'Band deleted successfully',
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },
};
