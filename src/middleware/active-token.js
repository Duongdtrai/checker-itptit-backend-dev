require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  EXCEPTION_API,
  STATUS_AUTHENTICATION,
} = require('./authentication.constants');
const { PREFIX } = require('./active-token.constant');
const dbModels = require('../utilities/dbModels');
const { SYSTEM_ADMIN } = require('../utilities/constants');

module.exports = async (req, res, next) => {
  try {
    const url = req.url.split('?')[0];

    // Ignore if this api does not require token

    if (!req.userData) {
      return next();
    }
    // check api is used for cms or app
    const paths = url.split('/');
    const userId = req.userData.userId;
    const data = await dbModels.usersModel.findOne({
      attributes: ['id', 'role', 'username', 'email'],
      where: {
        id: userId,
      },
      include: [
        {
          as: 'member',
          model: dbModels.membersModel,
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
            'createdAt',
          ],
        },
      ],
    });
    req.userData = data;
    const role = data.role;
    if (paths.includes(PREFIX.CMS_PREFIX) && role === SYSTEM_ADMIN.ADMIN) {
      return next();
    }
    if (paths.includes(PREFIX.LP_PREFIX) && +role === SYSTEM_ADMIN.MEMBER) {
      return next();
    }

    return res.status(STATUS_AUTHENTICATION[401].code).json({
      success: false,
      message: STATUS_AUTHENTICATION[401].message,
      error: error.message,
    });
  } catch (error) {
    return res.status(STATUS_AUTHENTICATION[401].code).json({
      success: false,
      message: STATUS_AUTHENTICATION[401].message,
      error: error.message,
    });
  }
};
