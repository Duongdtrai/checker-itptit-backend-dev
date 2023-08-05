const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./band.response-status');

module.exports = {
  getBands: async (req, res) => {
    try {
      const { priority } = req.query;
      const data = await dbModels.bandsModel.findAndCountAll({
        attributes: ['id', 'name', 'priority', 'createdAt', 'updatedAt'],
        where: {
          isDeleted: 0,
          priority,
        },
        order: [['createdAt', 'ASC']],
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
};
