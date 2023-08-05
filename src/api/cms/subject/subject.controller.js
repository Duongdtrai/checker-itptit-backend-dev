const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./subject.constants');
const {
  validateCreateSubject,
  validateSubjectId,
} = require('./subject.validate');

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
      const data = await dbModels.subjectsModel.findAndCountAll({
        offset,
        limit,
        attributes: ['id', 'name', 'createdAt', 'updatedAt'],
        where: { isDeleted: false },
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
      const id = await validateSubjectId.validateAsync(req.params.id);
      const subjectExists = await dbModels.subjectsModel.findOne({
        attributes: ['id', 'name', 'createdAt', 'updatedAt'],
        where: { id, isDeleted: false },
      });
      if (!subjectExists) {
        throw new Error('Subject is not exist');
      }
      return res.status(statusCode[200].code).json({
        data: subjectExists,
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
      const { name } = await validateCreateSubject.validateAsync(req.body);
      const subjectExist = await dbModels.subjectsModel.findOne({
        where: {
          name,
        },
      });
      if (subjectExist) {
        throw new Error('Subject is exist');
      }
      const subjectNew = await dbModels.subjectsModel.create(
        { name },
        { transaction }
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: 'Subject created successfully!',
        data: subjectNew,
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
      const id = await validateSubjectId.validateAsync(req.params.id);
      const { name } = await validateCreateSubject.validateAsync(req.body);
      const subjectExist = await dbModels.subjectsModel.findOne({
        attributes: ['id', 'isDeleted'],
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!subjectExist) {
        throw new Error('Subject is not exist');
      }
      const subjectNew = await dbModels.subjectsModel.update(
        { name },
        {
          where: {
            id,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: 'Subject update successfully!',
        data: subjectNew,
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
      const id = await validateSubjectId.validateAsync(req.params.id);
      const skillExists = await dbModels.subjectsModel.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!skillExists) {
        throw new Error('Subject does not exist');
      }
      await dbModels.subjectsModel.update(
        { isDeleted: true },
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
