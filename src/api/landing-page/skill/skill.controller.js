const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./skill.constant');

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
};
