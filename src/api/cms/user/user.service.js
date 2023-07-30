const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');

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
};
