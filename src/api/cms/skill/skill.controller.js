const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./skill.constant');
const { validateSkillId, validateCreateSkill } = require('./skill.validate');

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

      const data = await dbModels.skillsModel.findAndCountAll({
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
      const id = await validateSkillId.validateAsync(req.params.id);
      const skillExists = await dbModels.skillsModel.findOne({
        attributes: ['id', 'name', 'createdAt', 'updatedAt', 'isDeleted'],
        where: { id, isDeleted: false },
      });
      if (!skillExists) {
        throw new Error('Skill does not exist');
      }
      return res.status(statusCode[200].code).json({
        data: skillExists,
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
      const { name } = await validateCreateSkill.validateAsync(req.body);
      const data = await dbModels.skillsModel.create(
        {
          name,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        data,
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
      const id = await validateSkillId.validateAsync(req.params.id);
      const { name } = await validateCreateSkill.validateAsync(req.body);
      const skillExists = await dbModels.skillsModel.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!skillExists) {
        throw new Error('Skill does not exist');
      }
      const data = await dbModels.skillsModel.update(
        { name },
        { where: { id }, transaction }
      );
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        data,
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
      const id = await validateSkillId.validateAsync(req.params.id);
      const skillExists = await dbModels.skillsModel.findOne({
        where: {
          id,
          isDeleted: true,
        },
      });
      if (!skillExists) {
        throw new Error('Skill does not exist');
      }
      await dbModels.skillsModel.update(
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
