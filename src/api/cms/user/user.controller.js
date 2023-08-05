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
        userId,
        email,
        username,
        fullName,
        gender,
        birthday,
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
        listSkills,
        listBands,
        timeOutstanding,
        checkOutstanding,
      } = req.body;
      await validateChangeUser.validateAsync(req.body);
      const memberExist = await dbModels.membersModel.findOne({
        attributes: ['userId', 'id'],
        where: {
          userId,
        },
      });
      if (!memberExist) {
        throw new Error('User is not exist');
      }
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
      if (listSkills?.length > 0) {
        await userService.updateSkills(listSkills, memberExist.id, transaction);
      }
      if (listBands?.length > 0) {
        await userService.updateBandAndRole(
          listBands,
          memberExist.id,
          transaction
        );
      }
      await userService.updateOutstanding(
        checkOutstanding,
        timeOutstanding,
        memberExist.id,
        transaction
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
        listSkills,
        listBands,
        timeOutstanding,
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
      const newMember = await dbModels.membersModel.create(
        {
          userId: newUser.id,
          fullName,
          gender,
          birthday,
          hometown,
          major,
          job,
          course: course.toUpperCase(),
          team,
          achievements,
          quote,
          isFamous,
          hobby,
          description,
        },
        {
          transaction,
        }
      );
      if (listSkills?.length > 0) {
        await userService.updateSkills(listSkills, newMember.id, transaction);
      }
      if (listBands?.length > 0) {
        await userService.updateBandAndRole(
          listBands,
          newMember.id,
          transaction
        );
      }
      if (0 < timeOutstanding && timeOutstanding <= 12) {
        await userService.updateOutstanding(
          timeOutstanding,
          memberExist.id,
          transaction
        );
      }
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
      const { width, height, typeUpload } = req.query;
      let resize = false;
      if (Number(width) && Number(height)) {
        resize = {
          width,
          height,
        };
      }
      const image = await imageService.saveUploadImageGgCloud(
        req,
        {
          FOLDER_UPLOAD: 'user',
        },
        resize
      );

      if (typeUpload === 'image') {
        await userService.uploadImageData(req, image, transaction);
      } else if (typeUpload === 'avatar') {
        await userService.uploadAvatarData(req, image, transaction);
      } else {
        throw new Error('Please choose type upload image');
      }
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
      const { page, size } = req.query;
      let offset = 0;
      let limit = 10;
      if (page && size) {
        offset = (Number(page) - 1) * Number(size);
      }
      if (size) {
        limit = Number(size);
      }
      const { type_sort, courses, teams, bands, skills, roles } = req.body;

      /** search for course or teams */
      const whereConfig = {
        where: {
          ...(courses ? { course: { [Op.in]: courses } } : {}),
          ...(teams ? { team: { [Op.in]: teams } } : {}),
          isDeleted: false,
        },
      };

      /** search for bands or team project */
      const bandsConfig = {
        where: {
          ...(bands?.length > 0 ? { id: { [Op.in]: bands } } : {}),
          isDeleted: false,
        },
      };

      /** search for skills */
      const skillsConfig = {
        where: {
          ...(skills ? { id: { [Op.in]: skills } } : {}),
          isDeleted: false,
        },
      };

      /** search for chức vụ */
      const roleConfig = {
        where: {
          ...(roles?.length > 0 ? { role: { [Op.in]: roles } } : {}),
          isDeleted: false,
        },
      };

      const data = await dbModels.membersModel.findAndCountAll({
        offset,
        limit,
        attributes: [
          'id',
          'fullName',
          'birthday',
          'image',
          'avatar',
          'hometown',
          'major',
          'job',
          'course',
          'team',
          'achievements',
          'quote',
          'hobby',
          'description',
          'gender',
          'isFamous',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            attributes: ['id', 'name', 'priority', 'createdAt', 'updatedAt'],
            model: dbModels.bandsModel,
            through: {
              attributes: [
                'bandId',
                'memberId',
                'periodId',
                'createdAt',
                'updatedAt',
              ],
              model: dbModels.memberBandsModel,
              ...roleConfig,
            },
            ...bandsConfig,
          },
          {
            attributes: ['id', 'name', 'createdAt', 'updatedAt'],
            model: dbModels.skillsModel,
            through: {
              attributes: ['memberId', 'skillId', 'createdAt', 'updatedAt'],
              model: dbModels.memberSkillModel,
            },
            ...skillsConfig,
          },
          {
            model: dbModels.usersModel,
            attributes: ['id', 'email', 'username', 'createdAt', 'updatedAt'],
          },
        ],
        ...whereConfig,
        order: type_sort?.length === 2 ? [type_sort] : [['createdAt', 'DESC']],
      });

      data.rows.forEach((value, index) => {
        if (value?.image) {
          data.rows[index].image = imageService.getFullPathFileGgStorage(
            value?.image
          );
        }
        if (value?.avatar) {
          data.rows[index].avatar = imageService.getFullPathFileGgStorage(
            value?.avatar
          );
        }
      });
      return res.status(STATUS_CODE[208].code).json({
        success: true,
        message: STATUS_CODE[208].message,
        data: {
          count: data?.rows?.length,
          rows: data?.rows,
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

  getAllOutStanding: async (req, res) => {
    try {
      const { page, size, startedAt, endedAt } = req.query;
      let offset = 0;
      let limit = 10;
      if (page && size) {
        offset = (Number(page) - 1) * Number(size);
      }
      if (size) {
        limit = Number(size);
      }
      const startDate = startedAt
        ? moment(startedAt).toDate()
        : moment(new Date('1970-01-01')).toDate();
      const endDate = endedAt
        ? moment(endedAt).toDate()
        : moment(new Date()).toDate();

      if (!startedAt && !endedAt) {
        throw new Error('Please choose date');
      }

      let outStandingData =
        await dbModels.outstandingMembersModel.findAndCountAll({
          offset,
          limit,
          attributes: ['id', 'time', 'createdAt', 'updatedAt'],
          include: [
            {
              model: dbModels.membersModel,
              attributes: [
                'id',
                'fullName',
                'birthday',
                'image',
                'hometown',
                'major',
                'job',
                'course',
                'team',
                'achievements',
                'quote',
                'hobby',
                'description',
                'gender',
                'createdAt',
                'updatedAt',
              ],
            },
          ],
          where: {
            time: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
            isDeleted: false,
          },
          order: [['createdAt', 'DESC']],
        });

      outStandingData.rows.forEach((value, index) => {
        if (value?.member?.avatar) {
          data.rows[index].member.avatar =
            imageService.getFullPathFileGgStorage(value?.member?.avatar);
        }
      });

      return res.status(STATUS_CODE[209].code).json({
        success: true,
        message: STATUS_CODE[209].message,
        data: outStandingData,
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
