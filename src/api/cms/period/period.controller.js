const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./period.constant');
const { validateCreatePeriod, validatePeriodId } = require('./period.validate');

module.exports = {
  getAll: async (req, res) => {
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

      const data = await dbModels.periodsModel.findAndCountAll({
        offset,
        limit,
        attributes: ['id', 'startedAt', 'endedAt', 'createdAt', 'updatedAt'],
        where: {
          isDeleted: false,
        },
        order: [['createdAt', 'DESC']],
      });

      return res.status(statusCode[200].code).json({
        data,
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
      const id = await validatePeriodId.validateAsync(req.params.id);
      const periodExist = await dbModels.periodsModel.findOne({
        attributes: ['id', 'startedAt', 'endedAt', 'createdAt', 'updatedAt'],
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!periodExist) {
        throw new Error('Period is not exist');
      }

      return res.status(statusCode[200].code).json({
        data: periodExist,
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
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { startedAt, endedAt } = await validateCreatePeriod.validateAsync(
        req.body
      );

      if (new Date(startedAt) > new Date(endedAt)) {
        throw new Error('Started Date must be less than end Date');
      }
      const periodNew = await dbModels.periodsModel.create(
        {
          startedAt,
          endedAt,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        data: periodNew,
        success: true,
        message: statusCode[200].message,
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

  update: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const id = await validatePeriodId.validateAsync(req.params.id);
      const { startedAt, endedAt } = await validateCreatePeriod.validateAsync(
        req.body
      );
      const periodExist = await dbModels.periodsModel.findOne({
        attributes: ['id'],
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!periodExist) {
        throw new Error('Period is not exist');
      }
      if (new Date(startedAt) > new Date(endedAt)) {
        throw new Error('Started Date must be less than end Date');
      }
      await dbModels.periodsModel.update(
        { startedAt, endedAt },
        { where: { id }, transaction }
      );
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
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

  delete: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const id = await validatePeriodId.validateAsync(req.params.id);
      const periodExist = await dbModels.periodsModel.findOne({
        attributes: ['id', 'isDeleted'],
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!periodExist) {
        throw new Error('Period is not exist');
      }
      await dbModels.periodsModel.update(
        { isDeleted: 1 },
        { where: { id }, transaction }
      );
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
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
