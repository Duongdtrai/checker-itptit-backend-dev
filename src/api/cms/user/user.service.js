const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');
const dbModels = require('../../../utilities/dbModels');
const imageService = require('../../../utilities/image');

module.exports = {
  /**
   * Promise generator password
   * @param {String} password the password of user
   *
   * @returns {String}
   */
  genPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },

  /**
   * List admin
   * @param {Object} body an object contain roleId, filter, page, size
   * @returns {Promise}
   */
  comparePassword: (bodyPassword, passwordDb) => {
    return bcrypt.compareSync(bodyPassword, passwordDb);
  },

  /**
   * Generate JWT web token
   * @param {*} data
   *
   * @returns {String}
   */
  generateToken: (data) => {
    return jsonwebtoken.sign(
      {
        ...data,
      },
      process.env.TOKEN_PRIVATE_KEY,
      {
        expiresIn: Number(process.env.TOKEN_EXPIRES_IN) * 1000,
      }
    );
  },

  formatDateToDDMMYYYYForPassword: (dateString) => {
    const dateWithSlash = moment(dateString, 'D/M/YYYY', true);
    if (dateWithSlash.isValid()) {
      return dateWithSlash.format('DDMMYYYY');
    }
    const dateWithDash = moment(dateString, 'DD-MM-YYYY', true);
    if (dateWithDash.isValid()) {
      return dateWithDash.format('DDMMYYYY');
    }
    return null;
  },

  formatDateToDDMMYYYYForBirthday: (dateString) => {
    const dateWithSlash = moment(dateString, 'D/M/YYYY', true);
    if (dateWithSlash.isValid()) {
      return dateWithSlash.format('YYYY-MM-DD HH:mm:ss');
    }
    const dateWithDash = moment(dateString, 'DD-MM-YYYY', true);
    if (dateWithDash.isValid()) {
      return dateWithDash.format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
  },

  uploadImageData: async (req, image, transaction) => {
    if (req.userData.member.image) {
      await imageService.deleteImageGgCloud(req.userData.member.image);
    }
    await dbModels.membersModel.update(
      {
        image: image,
      },
      {
        where: {
          userId: req.userData.id,
        },
        transaction,
      }
    );
  },

  uploadAvatarData: async (req, avatar, transaction) => {
    if (req.userData.member.avatar) {
      await imageService.deleteImageGgCloud(req.userData.member.avatar);
    }
    await dbModels.membersModel.update(
      {
        avatar: avatar,
      },
      {
        where: {
          userId: req.userData.id,
        },
        transaction,
      }
    );
  },

  updateSkills: async (listSkills, memberId, transaction) => {
    const memberSkillExist = await dbModels.memberSkillModel.count({
      attributes: ['id', 'memberId', 'skillId'],
      where: {
        isDeleted: false,
        memberId,
      },
    });
    if (memberSkillExist > 0) {
      await dbModels.memberSkillModel.destroy({
        where: {
          memberId,
        },
        transaction,
      });
    }
    for (let skill of listSkills) {
      const skillExists = await dbModels.skillsModel.findOne({
        attributes: ['id'],
        where: {
          isDeleted: false,
          id: skill,
        },
      });
      if (!skillExists) {
        throw new Error('Skill does not exist');
      }
      await dbModels.memberSkillModel.create(
        {
          memberId,
          skillId: skill,
        },
        {
          transaction,
        }
      );
    }
  },

  updateBandAndRole: async (listBands, memberId, transaction) => {
    const memberBandExist = await dbModels.memberBandsModel.count({
      attributes: ['id', 'memberId', 'bandId'],
      where: {
        isDeleted: false,
        memberId,
      },
    });
    if (memberBandExist > 0) {
      await dbModels.memberBandsModel.destroy({
        where: {
          memberId,
        },
        transaction,
      });
    }
    for (let band of listBands) {
      const bandExist = await dbModels.bandsModel.findOne({
        attributes: ['id'],
        where: {
          isDeleted: false,
          id: band.id,
        },
      });
      const periodExist = await dbModels.periodsModel.findOne({
        attributes: ['id'],
        where: {
          isDeleted: false,
          id: band.periodId,
        },
      });
      if (!bandExist) {
        throw new Error('Band does not exist');
      }
      if (!periodExist) {
        throw new Error('Period does not exist');
      }
      await dbModels.memberBandsModel.create(
        {
          memberId,
          bandId: band.id,
          role: band.role,
          periodId: band.periodId,
        },
        {
          transaction,
        }
      );
    }
  },

  updateOutstanding: async (
    checkOutstanding,
    timeOutstanding,
    memberId,
    transaction
  ) => {
    if (checkOutstanding) {
      await dbModels.outstandingMembersModel.create(
        {
          memberId,
          time: timeOutstanding,
        },
        {
          transaction,
        }
      );
    } else {
      const outStandingMemberExist =
        await dbModels.outstandingMembersModel.count({
          where: {
            memberId,
          },
        });
      if (outStandingMemberExist > 0) {
        await dbModels.outstandingMembersModel.update(
          {
            isDeleted: true,
          },
          {
            where: {
              memberId,
            },
          }
        );
      }
    }
  },
};
