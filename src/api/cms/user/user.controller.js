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
const memberController = require('./member.controller');

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
        req.userData.member.image = imageService.getFullPathFile(
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
      console.log(
        'password',
        await userService.genPassword(moment(birthday).format('DD-MM-YYYY'))
      );
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
    console.log('Duong');
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
        console.log('result', result);
        const newData = {
          email: result[COLUMN_USER_IMPORT.email],
          username: result[COLUMN_USER_IMPORT.username],
          birthday: moment(result[COLUMN_USER_IMPORT.password]).format(
            'YYYY-MM-DD'
          ),
          fullName: result[COLUMN_USER_IMPORT.fullName],
          course: result[COLUMN_USER_IMPORT.course],
          team: result[COLUMN_USER_IMPORT.team],
        };
        console.log('newData', newData);
        // await validateCmsImportFile.validateAsync(newData);
        // const userExist = await dbModels.usersModel.findOne({
        //   where: {
        //     [Op.or]: [
        //       {
        //         email: newData?.email,
        //       },
        //       {
        //         username: newData?.username,
        //       },
        //     ],
        //   },
        // });
        // if (userExist) {
        //   await dbModels.usersModel.update(
        //     {
        //       email: newData?.email,
        //       username: newData?.username,
        //     },
        //     {
        //       where: {
        //         id: userExist.id,
        //       },
        //       transaction,
        //     }
        //   );
        //   await dbModels.membersModel.update(
        //     {
        //       birthday: newData?.birthday,
        //       fullName: newData?.fullName,
        //       gender: newData?.gender,
        //     },
        //     {
        //       where: {
        //         userId: userExist.id,
        //       },
        //       transaction,
        //     }
        //   );
        // } else {
        //   const newUser = await dbModels.usersModel.create(
        //     {
        //       email: newData?.email,
        //       username: newData?.username,
        //       password: await userService.genPassword(
        //         moment(newData?.birthday).format('DDMMYYYY')
        //       ),
        //       role: SYSTEM_ADMIN.MEMBER,
        //     },
        //     {
        //       transaction,
        //     }
        //   );
        //   await dbModels.membersModel.create(
        //     {
        //       userId: newUser.id,
        //       birthday: newData?.birthday,
        //       fullName: newData?.fullName,
        //       gender: newData?.gender,
        //     },
        //     {
        //       transaction,
        //     }
        //   );
        // }
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
      const image = await imageService.saveUploadImage(req, {
        FOLDER_UPLOAD: 'user',
      });
      if (req.userData.member.image) {
        await imageService.deleteImage(req.userData.member.image);
      }
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

  ...memberController,
};
