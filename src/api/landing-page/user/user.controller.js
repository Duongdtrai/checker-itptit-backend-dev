const dbModels = require('../../../utilities/dbModels');
const { SYSTEM_ADMIN, STATUS_CODE } = require('./user.constant');
const {
  validateCmsAuthenticationSchema,
  validateChangePassword,
  validateEmail,
  validateChangeUser,
  validatePassword,
} = require('./user.validate');
const userService = require('./user.service');
const sendEmail = require('../../../core/mailer/sendMail.service');
const crypto = require('crypto');
const moment = require('moment');
const imageService = require("../../../utilities/image");

module.exports = {
  getDetailMemberLP: async (req, res) => {
    try {
      if (req.userData.member.image) {
        req.userData.member.image = imageService.getFullPathFile(req.userData.member.image)
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

  loginLP: async (req, res) => {
    try {
      const { username, password } = req.body;
      await validateCmsAuthenticationSchema.validateAsync(req.body);

      const dataUser = await dbModels.usersModel.findOne({
        attributes: ['email', 'password', 'id', 'role'],
        where: {
          username: username,
          role: SYSTEM_ADMIN.MEMBER,
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

  changePasswordLP: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { password, newPassword } = req.body;
      await validateChangePassword.validateAsync(req.body);
      const userExist = await dbModels.usersModel.findOne({
        attributes: ['id', 'password', 'email', 'role'],
        where: {
          id: req.userData.id,
          role: SYSTEM_ADMIN.MEMBER,
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
            role: SYSTEM_ADMIN.MEMBER,
            email: req.userData.email,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(STATUS_CODE[201].code).json({
        success: false,
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
  changeInfoMember: async (req, res) => {
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
            role: SYSTEM_ADMIN.MEMBER,
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

  forgotPasswordLP: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { email } = req.body;
      await validateEmail.validateAsync(email);
      const userExist = await dbModels.usersModel.findOne({
        where: {
          email
        },
      });
      if (!userExist) {
        return res.status(STATUS_CODE[404].code).json({
          success: false,
          message: STATUS_CODE[404].message,
        });
      }
      const userVerificationsExist =
        await dbModels.userVerificationsModel.findOne({
          where: {
            userId: userExist.id,
          },
        });
      const token = crypto.randomBytes(32).toString('hex');
      var currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + 5);
      var newDate = currentDate.toISOString();
      if (userVerificationsExist) {
        await dbModels.userVerificationsModel.update(
          {
            uniqueString: token,
            expiredAt: newDate,
          },
          {
            where: {
              userId: userExist.id,
            },
            transaction,
          }
        );
      } else {
        await dbModels.userVerificationsModel.create(
          {
            userId: userExist.id,
            uniqueString: token,
            expiredAt: newDate,
          },
          {
            transaction,
          }
        );
      }
      const htmlContent = `
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                <a href="https://itptit.com/" title="logo" target="_blank">
                                  <img width="100" src="https://tutorail-access-libraly.s3.us-west-2.amazonaws.com/logo_itptit.png" title="logo" alt="logo">
                                </a>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                  requested to reset your password</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  We cannot simply send you your old password. A unique link to reset your
                                                  password has been generated for you. To reset your password, click the
                                                  following link and follow the instructions.
                                              </p>
                                              <a href="${process.env.BASE_URL
        }/landing-page/user/reset_password/${userExist.id}/${token}"
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                  Password</a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                  <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://itptit.com/</strong></p>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
        `;
      await sendEmail(
        email,
        '[VERIFY FORGOT PASSWORD EMAIL FROM ITPTIT CLUB]',
        htmlContent
      );
      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: STATUS_CODE[206].message,
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

  resetPasswordLP: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { user_id, unique_string } = req.params;
      const userVerificationsExist =
        await dbModels.userVerificationsModel.findOne({
          where: {
            userId: user_id,
            uniqueString: unique_string,
          },
        });
      if (!userVerificationsExist) {
        res.render('error');
      } else {
        await dbModels.userVerificationsModel.delete({
          where: {
            userId: +user_id,
          },
          transaction,
        });
        const expiredDate = moment(userVerificationsExist.expiredAt).utcOffset('+07:00');
        const currentDate = moment().utcOffset('+07:00');
        await transaction.commit();
        if (currentDate <= expiredDate) {
          if (userVerificationsExist?.expiredAt)
            res.render('reset-password');
        } else {
          res.render('error');
        }
      }
    } catch (error) {
      await transaction.rollback();
      res.render('error');
    }
  },

  resetPasswordPostLP: async (req, res) => {
    const transaction = await itptit.db.sequelize.transaction();
    try {
      const { user_id } = req.params;
      const { password } = req.body;
      await validatePassword.validateAsync(password);
      const userExist = await dbModels.usersModel.findOne({
        where: {
          id: +user_id,
        },
      });

      if (!userExist) {
        return res.status(STATUS_CODE[406].code).json({
          success: false,
          message: STATUS_CODE[406].message,
        });
      } else {
        // change password
        await dbModels.usersModel.update(
          {
            password: await userService.genPassword(password),
          },
          {
            where: {
              id: +user_id,
            },
            transaction,
          }
        );
        await transaction.commit();
        return res.status(STATUS_CODE[201].code).json({
          success: true,
          message: STATUS_CODE[201].message,
        });
      }
    } catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  },

  uploadImage: async  (req, res) => { 
    const transaction = await itptit.db.sequelize.transaction();
    try {
			const image = await imageService.saveUploadImage(req, {
				FOLDER_UPLOAD: "user",
			});
      if (req.userData.member.image) {
        await imageService.deleteImage(req.userData.member.image)
      }
      await dbModels.membersModel.update({
        image: image
      }, {
        where: {
          userId: req.userData.id
        }
      })
      await transaction.commit();
      return res.status(STATUS_CODE[207].code).json({
        success: true,
        message: STATUS_CODE[207].message,
      });
    } 
    catch (error) {
      await transaction.rollback();
      return res.status(STATUS_CODE[500].code).json({
        success: false,
        message: STATUS_CODE[500].message,
        error: error.message,
      });
    }
  }
};
