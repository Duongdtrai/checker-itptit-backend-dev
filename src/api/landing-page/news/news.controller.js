const moment = require('moment');
const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./news.constants');
const {
  validateNewId,
  validateUpdateComment,
  validateDeleteComment,
  validateCreateComment,
} = require('./news.validate');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const imageService = require('../../../utilities/image');

module.exports = {
  getById: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const id = await validateNewId.validateAsync(req.params.id);
      const newsExist = await dbModels.newsModel.findOne({
        attributes: [
          'id',
          'title',
          'content',
          'createdAt',
          'updatedAt',
          'isPublic',
          [
            sequelize.literal(
              `(select count(Viewers.memberId) from Viewers where newsId = news.id)`
            ),
            'views',
          ],
        ],
        include: [
          {
            as: 'list_subjects',
            model: dbModels.subjectsModel,
            attributes: ['id', 'name', 'createdAt', 'updatedAt'],
            through: {
              attributes: [
                'id',
                'newsId',
                'subjectId',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: dbModels.thumbnailsModel,
            as: 'thumbnails',
            attributes: ['id', 'url', 'createdAt', 'updatedAt'],
          },
          {
            model: dbModels.viewersModel,
            attributes: ['id', 'memberId', 'createdAt', 'updatedAt'],
            include: [
              {
                model: dbModels.membersModel,
                attributes: ['fullName', 'course', 'team'],
              },
            ],
          },
        ],
        where: {
          id,
          isPublic: 1,
          isDeleted: false,
        },
      });
      if (!newsExist) {
        throw new Error('News is not exist');
      }
      if (newsExist?.thumbnails[0]?.url) {
        newsExist.thumbnails[0].url = imageService.getFullPathFileGgStorage(
          newsExist.thumbnails[0].url
        );
      }
      const viewerExist = await dbModels.viewersModel.findOne({
        attributes: ['id', 'memberId', 'newsId', 'isDeleted'],
        where: {
          memberId: req.userData.member.id,
          newsId: id,
          isDeleted: 0,
        },
      });
      if (!viewerExist) {
        await dbModels.viewersModel.create(
          {
            memberId: req.userData.member.id,
            newsId: id,
          },
          {
            transaction,
          }
        );
      }
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        data: newsExist,
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

  getAll: async (req, res) => {
    try {
      const { page, size, typeSort, year, event } = req.body;
      let offset = 0;
      let limit = 10;
      if (page && size) {
        offset = (Number(page) - 1) * Number(size);
      }
      if (size) {
        limit = Number(size);
      }
      let sortData = typeSort?.length > 0 ? typeSort : null;

      // query for year
      let whereConfigYear = [];
      if (year && Array.isArray(year) && year?.length > 0) {
        const listYear = year;
        whereConfigYear = listYear.map((value) => {
          const startDate = moment(`${value}-01-01`).startOf('year').toDate();
          const endDate = moment(`${value}-12-31`).endOf('year').toDate();
          return {
            createdAt: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          };
        });
      }
      // query for events
      let whereConfigSubject = [];
      if (event && Array.isArray(event) && event?.length > 0) {
        const listSubject = event;
        whereConfigSubject = listSubject.map((subject) => ({
          id: subject,
        }));
      }
      const operation = {
        offset,
        limit,
        attributes: [
          'id',
          'title',
          'content',
          'isPublic',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `(select count(Viewers.memberId) from Viewers where newsId = news.id)`
            ),
            'views',
          ],
        ],
        include: [
          {
            as: 'list_subjects',
            model: dbModels.subjectsModel,
            attributes: ['id', 'name', 'createdAt', 'updatedAt'],
            through: {
              attributes: [
                'id',
                'newsId',
                'subjectId',
                'createdAt',
                'updatedAt',
              ],
              model: dbModels.newsSubjectsModel,
            },
          },
          {
            model: dbModels.viewersModel,
            attributes: ['id', 'memberId', 'createdAt', 'updatedAt'],
            include: [
              {
                model: dbModels.membersModel,
                attributes: ['fullName', 'course', 'team'],
              },
            ],
          },
        ],
        where: {
          [Op.and]: [
            {
              isDeleted: false,
            },
          ],
        },
        order: [sortData || ['createdAt', 'DESC']],
      };

      if (whereConfigYear?.length > 0) {
        operation.where[Op.and].push({
          [Op.or]: whereConfigYear,
        });
      }

      if (whereConfigSubject?.length > 0) {
        operation.include[0].where = {
          [Op.or]: whereConfigSubject,
        };
      }

      const data = await dbModels.newsModel.findAndCountAll(operation);
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

  getNewsComments: async (req, res) => {
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
      const id = await validateNewId.validateAsync(req.params.id);
      const data = await dbModels.newsCommentsModel.findAndCountAll({
        offset,
        limit,
        attributes: ['id', 'content', 'createdAt', 'updatedAt'],
        include: [
          {
            model: dbModels.membersModel,
            as: 'member',
            attributes: ['fullName', 'avatar'],
          },
        ],
        where: { newsId: id, isDeleted: false },
        order: [['createdAt', 'DESC']],
      });
      data.rows.forEach((value, index) => {
        if (value?.member?.avatar) {
          data.rows[index].member.avatar =
            imageService.getFullPathFileGgStorage(value?.member?.avatar);
        }
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

  createComment: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { content, newsId } = await validateCreateComment.validateAsync(
        req.body
      );
      const memberId = req.userData.member.id;
      const newsExist = await dbModels.newsModel.findOne({
        attributes: ['id'],
        where: {
          id: newsId,
        },
      });
      if (!newsExist) {
        throw new Error('News is not exist');
      }

      await dbModels.newsCommentsModel.create(
        {
          content,
          newsId,
          memberId,
        },
        {
          transaction,
        }
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

  updateComment: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { content, newsId, id } = await validateUpdateComment.validateAsync(
        req.body
      );
      const userId = req.userData.member.id;
      const commentExist = await dbModels.newsCommentsModel.findOne({
        attributes: ['memberId', 'newsId', 'id'],
        where: {
          id,
          newsId,
          memberId: userId,
        },
      });
      if (!commentExist) {
        throw new Error('Comment is not exist');
      }
      const newComment = await dbModels.newsCommentsModel.update(
        {
          content,
        },
        {
          where: {
            id,
          },
          transaction,
        }
      );

      await transaction.commit();
      return res.status(statusCode[200].code).json({
        data: newComment,
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

  deleteComment: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { newsId, id } = await validateDeleteComment.validateAsync(
        req.body
      );
      const memberId = req.userData.member.id;
      const commentExist = await dbModels.newsCommentsModel.findOne({
        attributes: ['memberId', 'newsId', 'id'],
        where: {
          id,
          newsId,
          memberId,
        },
      });
      if (!commentExist) {
        throw new Error('Comment is not exist');
      }
      const newComment = await dbModels.newsCommentsModel.update(
        {
          isDeleted: 1,
        },
        {
          where: {
            id,
            memberId,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        data: newComment,
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
