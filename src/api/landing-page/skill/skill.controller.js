const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./skill.constant');

module.exports = {
  getAll: async (req, res) => {
    try {
      const skills = await dbModels.skillsModel.findAll({
        where: { isDeleted: false },
      });
      return res.status(statusCode[200].code).json({
        skills,
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
      const skill = await dbModels.skillsModel.findByPk(id, {
        where: { isDeleted: false },
      });
      return res.status(statusCode[200].code).json({
        skill,
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
      const { name } = req.body;
      const skill = await dbModels.skillsModel.create({
        name,
      });
      return res.status(statusCode[200].code).json({
        skill,
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
      const { name } = req.body;
      await dbModels.skillsModel.update({ name }, { where: { id } });
      const skill = await dbModels.skillsModel.findByPk(id);
      return res.status(statusCode[200].code).json({
        skill,
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
      await dbModels.skillsModel.update({ idDeleted: true }, { where: { id } });
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
