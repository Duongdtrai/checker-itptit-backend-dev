const dbModels = require('../../../utilities/dbModels');
const statusCode = require('./news.response-status');
const {
  validateCreateNews,
  validateNewId,
  validateUpdateComment,
  validateCreateComment,
  validateDeleteComment,
} = require('./news.validate');

const sequelize = require('sequelize');
const imageService = require('../../../utilities/image');
const { Op } = require('sequelize');
const moment = require('moment');

module.exports = {
  create: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { title, content, isPublic, listSubject } =
        await validateCreateNews.validateAsync(req.body);

      const data = await dbModels.newsModel.create(
        {
          title,
          content,
          isPublic,
        },
        { transaction }
      );
      if (listSubject?.length > 0) {
        for (let subject of listSubject) {
          const subjectExist = await dbModels.subjectsModel.findOne({
            attributes: ['id'],
            where: {
              id: subject,
            },
          });
          if (!subjectExist) {
            throw new Error('Subject is not exist');
          }
          const a = await dbModels.newsSubjectsModel.create(
            {
              newsId: data.id,
              subjectId: subject,
            },
            { transaction }
          );
        }
      }
      await transaction.commit();
      return res.status(statusCode[200].code).json({
        success: true,
        message: statusCode[200].message,
        data: data
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
      const id = await validateNewId.validateAsync(req.params.id);
      const { title, content, isPublic, listSubject } =
        await validateCreateNews.validateAsync(req.body);
      const newsExist = await dbModels.newsModel.findOne({
        attributes: ['id'],
        where: {
          id,
          isDeleted: 0,
        },
      });
      if (!newsExist) {
        throw new Error('News is not exist');
      }
      await dbModels.newsModel.update(
        { title, content, isPublic },
        { where: { id } }
      );

      // remove newsId in table news Subjects
      const newsSubjectsExist = await dbModels.newsSubjectsModel.count({
        where: {
          newsId: id,
          isDeleted: 0,
        },
      });
      if (newsSubjectsExist > 0) {
        await dbModels.newsSubjectsModel.destroy({
          where: {
            newsId: id,
          },
        });
      }

      if (listSubject?.length > 0) {
        for (let subject of listSubject) {
          await dbModels.newsSubjectsModel.create({
            newsId: id,
            subjectId: subject,
          });
        }
      }
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
      const id = await validateNewId.validateAsync(req.params.id);
      const newsExist = await dbModels.newsModel.findOne({
        attributes: ['id'],
        where: {
          id,
          isDeleted: 0,
        },
      });
      if (!newsExist) {
        throw new Error('News is not exist');
      }
      await dbModels.newsModel.update(
        { isDeleted: 1 },
        { where: { id }, transaction }
      );

      // remove newsId in table news Subjects
      const newsSubjectsExist = await dbModels.newsSubjectsModel.count({
        where: {
          newsId: id,
          isDeleted: 0,
        },
      });
      if (newsSubjectsExist > 0) {
        await dbModels.newsSubjectsModel.update(
          {
            isDeleted: 1,
          },
          {
            where: {
              newsId: id,
            },
          }
        );
      }
      // remove newsId in table thumbnails
      const thumbnailsExist = await dbModels.thumbnailsModel.findAll({
        attributes: ['id', 'newsId'],
        where: {
          newsId: id,
        },
      });
      if (thumbnailsExist?.length > 0) {
        await dbModels.thumbnailsModel.update(
          { isDeleted: 1 },
          { where: { newsId: id }, transaction }
        );
      }

      // remove newsId in table viewer
      const viewerExist = await dbModels.viewersModel.findAll({
        attributes: ['id', 'newsId'],
        where: {
          newsId: id,
        },
      });
      if (viewerExist?.length > 0) {
        await dbModels.viewersModel.update(
          { isDeleted: 1 },
          { where: { newsId: id }, transaction }
        );
      }

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

  getById: async (req, res) => {
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
        ],
        where: {
          id,
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
      return res.status(statusCode[200].code).json({
        data: newsExist,
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

  getAllNews: async (req, res) => {
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
              `(select count(viewers.memberId) from viewers where newsId = news.id)`
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

  uploadThumbnail: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const id = await validateNewId.validateAsync(req.params.id);
      const { width, height } = req.query;
      let resize = false;
      if (Number(width) && Number(height)) {
        resize = {
          width,
          height,
        };
      }

      const newsExist = await dbModels.newsModel.findOne({
        attributes: ['id'],
        where: {
          isDeleted: false,
          id,
        },
      });
      if (!newsExist) {
        throw new Error('News is not exist');
      }

      const image = await imageService.saveUploadImageGgCloud(
        req,
        {
          FOLDER_UPLOAD: 'news',
        },
        resize
      );
      const thumbnailsExist = await dbModels.thumbnailsModel.findAll({
        attributes: ['id', 'newsId'],
        where: {
          newsId: id,
        },
      });
      if (thumbnailsExist?.length === 0) {
        await dbModels.thumbnailsModel.create(
          {
            url: image,
            newsId: id,
          },
          {
            transaction,
          }
        );
      } else {
        if (thumbnailsExist[0].url) {
          await imageService.deleteImage(thumbnailsExist[0].url);
        }
        await dbModels.thumbnailsModel.update(
          {
            url: image,
          },
          {
            where: {
              newsId: id,
            },
            transaction,
          }
        );
      }
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
      const id = req.params.id;
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

  createNewsComments: async (req, res) => {
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

  updateNewsComments: async (req, res) => {
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

  deleteNewsComments: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { memberId, newsId, id } =
        await validateDeleteComment.validateAsync(req.body);
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
