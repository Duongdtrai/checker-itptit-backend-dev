require('dotenv').config();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

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
        expiresIn: process.env.TOKEN_EXPIRES_IN,
      }
    );
  },
};
