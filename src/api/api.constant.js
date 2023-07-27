const API = {
  ADMIN: {
    MEMBER: {
      ['CREATE']: '/cms/members/create',
      ['GET_ALL']: '/cms/members/all',
      ['ADD_BAND']: 'cms/members/bands/add',
      ['DELETE_BAND']: 'cms/members/bands/delete/:id',
      ['ADD_SKILL']: 'cms/members/skills/add',
      ['DELETE_SKILL']: 'cms/members/skills/delete/:id',
    },
    BAND: {
      ['GET_ALL']: '/cms/bands/',
      ['GET_BY_ID']: '/cms/bands/:id',
      ['CREATE']: '/cms/bands/create',
      ['UPDATE']: '/cms/bands/update/:id',
      ['DELETE']: '/cms/bands/delete/:id',
    },
    PERIOD: {
      ['GET_BY_ID']: '/cms/periods/:id',
      ['CREATE']: '/cms/periods/create',
      ['UPDATE']: '/cms/periods/update/:id',
    },
    OUTSTANDING_MEMBER: {
      ['GET_ALL']: '/cms/outstanding-members/all',
      ['UPDATE']: '/cms/outstanding-members/update/:id',
      ['DELETE']: '/cms/outstanding-members/delete/:id',
      ['CREATE']: '/cms/outstanding-members/create',
    },
    SKILL: {
      ['GET_ALL']: '/cms/skills/all',
      ['GET_BY_ID']: '/cms/skills/:id',
      ['CREATE']: '/cms/skills/create',
      ['UPDATE']: '/cms/skills/update/:id',
      ['DELETE']: '/cms/skills/delete/:id',
    },
    THUMBNAIL: {
      ['GET_BY_ID']: '/cms/thumbnails/:id',
      ['CREATE']: '/cms/thumbnails/create',
      ['UPDATE']: '/cms/thumbnails/update/:id',
      ['DELETE']: '/cms/thumbnails/delete/:id',
    },
    ORGANIZATION: {
      ['GET_BY_ID']: '/cms/organizations/:id',
      ['CREATE']: '/cms/organizations/create',
      ['UPDATE']: '/cms/organizations/update/:id',
      ['DELETE']: '/cms/organizations/delete/:id',
    },
    NEWS: {
      ['GET_BY_ID']: '/cms/news/:id',
      ['GET_ALL']: '/cms/news/all',
      ['CREATE']: '/cms/news/create',
      ['UPDATE']: '/cms/news/update/:id',
      ['DELETE']: '/cms/news/delete/:id',
    },
    USER: {
      ['LOGIN']: '/cms/user/login',
      ['CHANGE_PASSWORD']: '/cms/user/change_password',
      ['CREATE_ACCOUNT_MEMBER']: '/cms/user/create_account_member',
      ['IMPORT']: '/cms/user/import',
      ['DETAIL_ADMIN']: '/cms/user/detail',
      ['CHANGE_INFO']: '/cms/user/change_info',
      ['UPLOAD_IMAGE']: '/cms/user/upload_image'
    },
  },
  MEMBER: {
    USER: {
      ['LOGIN']: '/landing-page/user/login',
      ['CHANGE_PASSWORD']: '/landing-page/user/change_password',
      ['FORGOT_PASSWORD']: '/landing-page/user/forgot_password',
      ['RESET_PASSWORD']:
        '/landing-page/user/reset_password/:user_id/:unique_string',
      ['DETAIL_MEMBER']: '/landing-page/user/detail',
      ['CHANGE_INFO']: '/landing-page/user/change_info',
      ['UPLOAD_IMAGE']: '/landing-page/user/upload_image'
    },
  },
};

module.exports = API;
