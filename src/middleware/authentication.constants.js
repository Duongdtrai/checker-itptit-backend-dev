const EXCEPTION_API = {
  CMS_LOGIN: '/cms/user/login',
  LP_LOGIN: '/landing-page/user/login',
  CMS_FORGOT_PASSWORD: '/cms/user/forgot-password',
  LP_FORGOT_PASSWORD: '/landing-page/user/forgot_password',
  LP_RESET_PASSWORD: '/landing-page/user/reset_password',
};

const STATUS_AUTHENTICATION = {
  200: {
    code: 200,
    message: 'OK',
  },
  // 3xx Redirect
  301: {
    code: 301,
    message: 'OK',
  },
  // 4xx Client Error
  400: {
    code: 400,
    message: 'Bad Request',
  },
  401: {
    code: 401,
    message: 'Unauthorized',
  },
  403: {
    code: 403,
    message: 'Forbidden',
  },
  404: {
    code: 404,
    message: 'Not Found',
  },
  // 5xx Server Error
  500: {
    code: 500,
    message: 'Internal Server Error',
  },
  502: {
    code: 502,
    message: 'Bad Gateway',
  },
  // 6xx Application Error
  600: {
    code: 600,
    message: 'Invalid Token',
  },
  601: {
    code: 601,
    message: 'Invalid CSRF Token',
  },
  602: {
    code: 602,
    message: 'Restricted Access',
  },
};
module.exports = {
  EXCEPTION_API,
  STATUS_AUTHENTICATION,
};
