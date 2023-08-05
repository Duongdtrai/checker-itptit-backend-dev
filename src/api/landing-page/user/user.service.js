require('dotenv').config();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const dbModels = require('../../../utilities/dbModels');

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
};
