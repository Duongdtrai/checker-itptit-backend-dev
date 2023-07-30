const dbModels = require('../../../utilities/dbModels');
const {
  SYSTEM_ADMIN,
  STATUS_CODE,
  COLUMN_USER_IMPORT,
} = require('./user.constant');
const {
  validateCmsAuthenticationSchema,
  validateChangePassword,
  validateCmsCreateMember,
  validateCmsImportFile,
  validateChangeUser,
} = require('./user.validate');
const userService = require('./user.service');
const moment = require('moment');
const csv = require('csv-parser');
const fs = require('fs');
const { Op } = require('sequelize');
const imageService = require('../../../utilities/image');

module.exports = {
  loginCMS: async (req, res) => {
    try {
      const { username, password } = req.body;
      await validateCmsAuthenticationSchema.validateAsync(req.body);

      const dataUser = await dbModels.usersModel.findOne({
        attributes: ['email', 'password', 'id', 'role'],
        where: {
          username: username,
          role: SYSTEM_ADMIN.ADMIN,
          isDeleted: false,
        },
      });

      if (!dataUser) {
        return res.status(STATUS_CODE[412].code).json({
          success: false,
          message: STATUS_CODE[412].message,
        });
      }

      const isPasswordCorrect = await userService.comparePassword(
        password,
        dataUser.password
      );

      // handle check that password is correct or not
      if (!isPasswordCorrect) {
        return res.status(STATUS_CODE[409].code).json({
          success: false,
          message: STATUS_CODE[409].message,
        });
      }
      // generate jwt web token
      const token = userService.generateToken({
        userId: dataUser.id,
        email: dataUser.email,
      });
      return res.status(STATUS_CODE[200].code).json({
        success: true,
        message: STATUS_CODE[200].message,
        data: {
          token: token,
          userId: dataUser.id,
          role: dataUser.role,
        },
      });
    } catch (error) {
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  getDetailAdmin: async (req, res) => {
    try {
      if (req.userData.member.image) {
        req.userData.member.image = imageService.getFullPathFileGgStorage(
          req.userData.member.image
        );
      }
      return res.status(STATUS_CODE[204].code).json({
        success: false,
        message: STATUS_CODE[204].message,
        data: req.userData,
      });
    } catch (error) {
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  changePasswordCMS: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { password, newPassword } = req.body;
      await validateChangePassword.validateAsync(req.body);
      const userExist = await dbModels.usersModel.findOne({
        attributes: ['id', 'password', 'email', 'role'],
        where: {
          id: req.userData.id,
        },
      });
      if (!userExist) {
        return res.status(STATUS_CODE[406].code).json({
          success: false,
          message: STATUS_CODE[406].message,
        });
      }
      const checkPassword = await userService.comparePassword(
        password,
        userExist.password
      );
      if (!checkPassword) {
        await transaction.commit();
        return res.status(STATUS_CODE[409].code).json({
          success: false,
          message: STATUS_CODE[409].message,
        });
      }

      // change password
      await dbModels.usersModel.update(
        {
          password: await userService.genPassword(newPassword),
        },
        {
          where: {
            id: req.userData.id,
            role: SYSTEM_ADMIN.ADMIN,
            email: req.userData.email,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(STATUS_CODE[201].code).json({
        success: true,
        message: STATUS_CODE[201].message,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },
  changeInfoAdmin: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const {
        email,
        username,
        fullName,
        gender,
        birthday,
        image,
        hometown,
        major,
        job,
        course,
        team,
        achievements,
        quote,
        hobby,
        description,
        isFamous,
      } = req.body;
      await validateChangeUser.validateAsync(req.body);
      const userId = req.userData.id;
      await dbModels.usersModel.update(
        {
          email,
          username,
        },
        {
          where: {
            id: userId,
            role: SYSTEM_ADMIN.ADMIN,
            isDeleted: false,
          },
          transaction,
        }
      );
      await dbModels.membersModel.update(
        {
          fullName,
          gender,
          birthday,
          image,
          hometown,
          major,
          job,
          course: course.toUpperCase(),
          team,
          achievements,
          quote,
          hobby,
          description,
          isFamous,
        },
        {
          where: {
            userId,
            isDeleted: false,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(STATUS_CODE[205].code).json({
        success: true,
        message: STATUS_CODE[205].message,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  createAccountMember: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const {
        email,
        username,
        fullName,
        gender,
        birthday,
        image,
        hometown,
        major,
        job,
        course,
        team,
        achievements,
        quote,
        hobby,
        description,
        isFamous,
      } = req.body;
      await validateCmsCreateMember.validateAsync(req.body);

      const userExists = await dbModels.usersModel.findOne({
        where: {
          [Op.and]: {
            [Op.or]: [
              {
                email: email,
              },
              {
                username: username,
              },
            ],
            isDeleted: false,
          },
        },
      });
      if (userExists) {
        return res.status(STATUS_CODE[411].code).json({
          success: false,
          message: STATUS_CODE[411].message,
        });
      }
      const newUser = await dbModels.usersModel.create(
        {
          email,
          username,
          password: await userService.genPassword(
            moment(birthday).format('DDMMYYYY')
          ),
          role: SYSTEM_ADMIN.MEMBER,
        },
        {
          transaction,
        }
      );
      await dbModels.membersModel.create(
        {
          userId: newUser.id,
          fullName,
          gender,
          birthday,
          image,
          hometown,
          major,
          job,
          course: course.toUpperCase(),
          team,
          achievements,
          quote,
          isFamous,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      return res.status(STATUS_CODE[202].code).json({
        success: true,
        message: STATUS_CODE[202].message,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  importUser: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const resultFile = [];
      await new Promise((resolve, reject) => {
        const parser = fs
          .createReadStream(req.file.file.filepath)
          .pipe(csv({ delimiter: ';' }));
        parser.on('data', async (chunk) => {
          resultFile.push(chunk);
        });
        parser.on('error', reject);
        parser.on('end', () => {
          resolve(resultFile);
        });
      });
      for (let result of resultFile) {
        const newData = {
          email: result[COLUMN_USER_IMPORT.email],
          username: result[COLUMN_USER_IMPORT.username],
          birthday: userService.formatDateToDDMMYYYYForBirthday(
            result[COLUMN_USER_IMPORT.password]
          ),
          fullName: result[COLUMN_USER_IMPORT.fullName],
          course: result[COLUMN_USER_IMPORT.course],
          team: Number(result[COLUMN_USER_IMPORT.team]),
        };
        await validateCmsImportFile.validateAsync(newData);
        const userExist = await dbModels.usersModel.findOne({
          where: {
            [Op.or]: [
              {
                email: newData?.email.trim(),
              },
              {
                username: newData?.username.trim(),
              },
            ],
          },
        });
        if (userExist) {
          await dbModels.usersModel.update(
            {
              email: newData?.email.toUpperCase(),
              username: newData?.username.toLowerCase(),
            },
            {
              where: {
                id: userExist.id,
              },
              transaction,
            }
          );
          await dbModels.membersModel.update(
            {
              birthday: newData?.birthday,
              fullName: newData?.fullName,
              course: newData?.course?.toLowerCase(),
              team: newData?.team,
            },
            {
              where: {
                userId: userExist.id,
              },
              transaction,
            }
          );
        } else {
          const password = await userService.genPassword(
            userService.formatDateToDDMMYYYYForPassword(
              result[COLUMN_USER_IMPORT.password]
            )
          );
          const newUser = await dbModels.usersModel.create(
            {
              email: newData?.email,
              username: newData?.username,
              password: password,
              role: SYSTEM_ADMIN.MEMBER,
            },
            {
              transaction,
            }
          );
          await dbModels.membersModel.create(
            {
              userId: newUser.id,
              birthday: newData?.birthday,
              fullName: newData?.fullName,
              course: newData?.course?.toLowerCase(),
              team: newData?.team,
            },
            {
              transaction,
            }
          );
        }
      }
      await transaction.commit();
      return res.status(STATUS_CODE[203].code).json({
        success: true,
        message: STATUS_CODE[203].message,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  uploadImage: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const image = await imageService.saveUploadImageGgCloud(req, {
        FOLDER_UPLOAD: 'user',
      });
      if (req.userData.member.image) {
        await imageService.deleteImageGgCloud(req.userData.member.image);
      }
      console.log('image', image);
      await dbModels.membersModel.update(
        {
          image: image,
        },
        {
          where: {
            userId: req.userData.id,
          },
        }
      );
      await transaction.commit();
      return res.status(STATUS_CODE[207].code).json({
        success: true,
        message: STATUS_CODE[207].message,
        image: imageService.getFullPathFileGgStorage(image),
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  getAllMembers: async (req, res) => {
    try {
      const sort = req.body?.sort;
      const course = req.body?.course;
      const teams = req.body?.teams;
      const bands = req.body?.bands;
      const periods = req.body?.periods;
      const skills = req.body?.skills;

      const whereConfig = {
        where: {
          ...(course ? { course: { [Op.in]: course } } : {}),
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
      return res.status(STATUS_CODE[200].code).json({
        success: true,
        message: STATUS_CODE[200].message,
        members: data,
      });
    } catch (error) {
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  createComment: async (req, res) => {
    try {
      const memberId = req.userData.member.id;
      const { newsId } = req.params;
      const { content } = req.body;

      const comment = await dbModels.newsCommentsModel.create({
        memberId,
        newsId,
        content,
      });
      return res.status(STATUS_CODE[200].code).json({
        comment,
        success: true,
        message: STATUS_CODE[200].message,
      });
    } catch (error) {
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  updateComment: async (req, res) => {
    try {
      const memberId = req.userData.member.id;
      const { id } = req.params;
      const { content } = req.body;

      const comment = await dbModels.newsCommentsModel.findByPk(id);
      if (!comment)
        return res.status(STATUS_CODE[400].code).json({
          success: false,
          message: STATUS_CODE[400].message,
        });

      if (memberId !== comment.userId)
        return res.status(STATUS_CODE[403].code).json({
          success: false,
          message: STATUS_CODE[403].message,
          error: error.message,
        });

      await dbModels.newsCommentsModel.update({ content }, { where: { id } });

      return res.status(STATUS_CODE[200].code).json({
        success: true,
        message: STATUS_CODE[200].message,
      });
    } catch (error) {
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const memberId = req.userData.member.id;
      const { id } = req.params;

      const comment = await dbModels.newsCommentsModel.findByPk(id);
      if (!comment)
        return res.status(STATUS_CODE[400].code).json({
          success: false,
          message: STATUS_CODE[400].message,
        });

      if (memberId !== comment.userId)
        return res.status(STATUS_CODE[403].code).json({
          success: false,
          message: STATUS_CODE[403].message,
          error: error.message,
        });

      await dbModels.newsCommentsModel.update(
        { isDeleted: true },
        { where: { id } }
      );

      return res.status(STATUS_CODE[200].code).json({
        success: true,
        message: STATUS_CODE[200].message,
      });
    } catch (error) {
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },
};
