require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  EXCEPTION_API,
  STATUS_AUTHENTICATION,
} = require('./authentication.constants');

module.exports = async (req, res, next) => {
  try {
    const url = req.url.split('?')[0];
    if (
      Object.values(EXCEPTION_API).some((exception) =>
        url.startsWith(exception)
      )
    ) {
      return next();
    }
    const token = req.headers['authorization']
      ? req.headers['authorization'].replace(/Bearer|\s/g, '')
      : '';

    if (!token) {
      return res.status(STATUS_AUTHENTICATION[401].code).json({
        success: false,
        message: STATUS_AUTHENTICATION[401].message,
      });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY);
    if (!decoded || !decoded.userId) {
      return res.status(STATUS_AUTHENTICATION[401].code).json({
        success: false,
        message: STATUS_AUTHENTICATION[401].message,
      });
    }
    req.userData = {
      userId: decoded.userId,
      email: decoded.email ? decoded.email : '',
      token,
    };
    next();
  } catch (error) {
    return res.status(STATUS_AUTHENTICATION[401].code).json({
      success: false,
      message: STATUS_AUTHENTICATION[401].message,
      error: error.message,
    });
  }
};
