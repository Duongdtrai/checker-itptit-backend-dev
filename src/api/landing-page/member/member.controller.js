const { Op } = require('sequelize');
const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./member.constant');

module.exports = {
  getAllMembers: async (req, res) => {
    try {
      const sort = req.body?.sort;
      const classes = req.body?.classes;
      const teams = req.body?.teams;
      const bands = req.body?.bands;
      const periods = req.body?.periods;
      const skills = req.body?.skills;

      const whereConfig = {
        where: {
          ...(classes ? { class: { [Op.in]: classes } } : {}),
          ...(teams ? { team: { [Op.in]: teams } } : {}),
          isDeleted: false,
        },
      };
      const sortConfig = sort
        ? {
            order: [
              [sort.type === 'age' ? 'birthday' : 'fullName', sort.direction],
            ],
          }
        : {};
      const bandsConfig = {
        where: {
          ...(bands ? { id: { [Op.in]: bands } } : {}),
          isDeleted: false,
        },
      };
      const periodsConfig = {
        where: {
          ...(periods ? { id: { [Op.in]: periods } } : {}),
          isDeleted: false,
        },
      };
      const skillsConfig = {
        where: {
          ...(skills ? { id: { [Op.in]: skills } } : {}),
          isDeleted: false,
        },
      };
      const data = await dbModels.membersModel.findAll({
        ...whereConfig,
        ...sortConfig,
        include: [
          { model: dbModels.bandsModel, ...bandsConfig },
          { model: dbModels.periodsModel, ...periodsConfig },
          { model: dbModels.skillsModel, ...skillsConfig },
        ],
      });
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
        members: data,
      });
    } catch (error) {
      return res.status(statusCode[500].code).json({
        success: false,
        message: statusCode[500].message,
        error: error.message,
      });
    }
  },

  addBand: async (req, res) => {
    try {
      const { memberId, bandId, periodId, role } = req.body;
      const memberBand = await dbModels.memberBandsModel.create({
        memberId,
        bandId,
        periodId,
        role,
      });
      return res.status(statusCode[200].code).json({
        memberBand,
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

  deleteBand: async (req, res) => {
    try {
      const id = req.params.id;
      await dbModels.memberBandsModel.update(
        { idDeleted: true },
        { where: { id } }
      );
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

  addSkill: async (req, res) => {
    try {
      const { memberId, skillId } = req.body;
      const memberSkill = await dbModels.memberSkillModel.create({
        memberId,
        skillId,
      });
      return res.status(statusCode[200].code).json({
        memberSkill,
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

  deleteSkill: async (req, res) => {
    try {
      const id = req.params.id;
      await dbModels.memberSkillModel.update(
        { idDeleted: true },
        { where: { id } }
      );
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

  createMember: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const newMember = await dbModels.membersModel.create(
        {
          fullName: 'Nguyen Tien Dat',
          birthday: '2002-04-18',
          image: 'abc',
          hometown: 'Hanoi',
          major: 'CNTT',
          job: 'Fullstack',
          class: 'D20',
          team: 5,
          achievements: 'Dep trai',
          quote: 'Vo ban la vo toi?',
          userId: 1,
        },
        transaction
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: 'Member created successfully',
        member: newMember,
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

  createComment: async (req, res) => {
    try {
      const { memberId, newsId } = req.params;
      const { content } = req.body;
      const comment = await dbModels.newsCommentsModel.create({
        memberId,
        newsId,
        content,
      });
      return res.status(statusCode[200].code).json({
        comment,
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

  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      await dbModels.newsCommentsModel.update({ content }, { where: { id } });

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

  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      await dbModels.newsCommentsModel.update(
        { isDeleted: true },
        { where: { id } }
      );

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
