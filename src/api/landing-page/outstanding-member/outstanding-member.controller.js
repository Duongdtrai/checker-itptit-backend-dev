const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./outstanding-member.constant');

module.exports = {
  create: async (req, res) => {
    try {
      const { memberId, time } = req.body;
      const outstandingMember = await dbModels.outstandingMembersModel.create({
        memberId,
        time,
      });
      return res.status(statusCode[200].code).json({
        outstandingMember,
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
      const { time, memberId } = req.body;
      await dbModels.outstandingMembersModel.update(
        { time, memberId },
        { where: { id } }
      );
      const outstandingMember = await dbModels.outstandingMembersModel.findByPk(
        id
      );
      return res.status(statusCode[200].code).json({
        outstandingMember,
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

  getAll: async (req, res) => {
    try {
      const outstandingMembers = await dbModels.outstandingMembersModel.findAll(
        { where: { isDeleted: false } }
      );
      return res.status(statusCode[200].code).json({
        outstandingMembers,
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
      await dbModels.outstandingMembersModel.update(
        { isDeleted: true },
        { where: { id } }
      );
      const outstandingMember = await dbModels.outstandingMembersModel.findByPk(
        id
      );
      return res.status(statusCode[200].code).json({
        outstandingMember,
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
