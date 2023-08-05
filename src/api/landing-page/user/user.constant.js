/**
 * User Response Status
 */
const STATUS_CODE = {
  200: {
    code: 200,
    message: 'Login successfully',
  },
  201: {
    code: 201,
    message: 'Change Password successfully',
  },
  202: {
    code: 202,
    message: 'Create account member successfully',
  },
  203: {
    code: 203,
    message: 'Import file successfully',
  },
  204: {
    code: 200,
    message: 'Get details user successfully',
  },
  205: {
    code: 200,
    message: 'Change infor user successfully',
  },
  206: {
    code: 200,
    message: 'Send mail verify successfully',
  },
  207: {
    code: 200,
    message: 'Upload image successfully',
  },
  208: {
    code: 200,
    message: 'Get all member successfully',
  },
  209: {
    code: 200,
    message: 'Get all member outstanding successfully',
  },
  401: {
    code: 401,
    message: 'Role do not exist!',
  },
  402: {
    code: 402,
    message: 'Email or Password is incorrect!',
  },
  403: {
    code: 403,
    message: 'Default Admin cant edit or deactivate!',
  },
  404: {
    code: 404,
    message: 'Email is not exist in system!',
  },
  405: {
    code: 405,
    message: 'User is De-active!',
  },
  406: {
    code: 406,
    message: 'User is not exist!',
  },
  407: {
    code: 407,
    message: 'The new password is not the same as the current password',
  },
  409: {
    code: 409,
    message: 'The current password is not correct',
  },
  410: {
    code: 410,
    message: 'Please select another image!',
  },
  411: {
    code: 411,
    message: 'Email is exist!',
  },
  412: {
    code: 412,
    message: 'Username is not exist in system!',
  },
  500: {
    code: 500,
    message: 'Error server ',
  },
};

const SYSTEM_ADMIN = {
  MEMBER: 1,
  ADMIN: 2,
};

const USER_STATUS = {
  ACTIVE: 1,
  DE_ACTIVE: 0,
};

const COLUMN_USER_IMPORT = {
  email: 'Email',
  username: 'Ma sinh vien',
  birthday: 'Ngay sinh',
  fullName: 'fullname',
  gender: 'Gioi tinh',
};

module.exports = {
  STATUS_CODE,
  SYSTEM_ADMIN,
  USER_STATUS,
  COLUMN_USER_IMPORT,
};
