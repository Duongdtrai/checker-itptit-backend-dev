const API = {
  ADMIN: {
    BAND: {
      ['GET_ALL']: '/cms/bands',
      ['GET_BY_ID']: '/cms/bands/:id',
      ['CREATE']: '/cms/bands/create',
      ['UPDATE']: '/cms/bands/update/:id',
      ['DELETE']: '/cms/bands/delete/:id',
    },
    PERIOD: {
      ['GET_ALL']: '/cms/periods/all',
      ['GET_BY_ID']: '/cms/periods/:id',
      ['CREATE']: '/cms/periods/create',
      ['UPDATE']: '/cms/periods/update/:id',
      ['DELETE']: '/cms/periods/delete/:id',
    },
    SKILL: {
      ['GET_ALL']: '/cms/skills/all',
      ['GET_BY_ID']: '/cms/skills/:id',
      ['CREATE']: '/cms/skills/create',
      ['UPDATE']: '/cms/skills/update/:id',
      ['DELETE']: '/cms/skills/delete/:id',
    },
    SUBJECT: {
      ['GET_ALL']: '/cms/subjects/all',
      ['GET_BY_ID']: '/cms/subjects/:id',
      ['CREATE']: '/cms/subjects/create',
      ['UPDATE']: '/cms/subjects/update/:id',
      ['DELETE']: '/cms/subjects/delete/:id',
    },
    NEWS: {
      ['GET_ALL']: '/cms/news',
      ['GET_BY_ID']: '/cms/news/:id',
      ['CREATE']: '/cms/news/create',
      ['UPDATE']: '/cms/news/update/:id',
      ['DELETE']: '/cms/news/delete/:id',
      ['UPLOAD_THUMBNAIL']: '/cms/news/upload_thumbnail/:id',

      ['GET_COMMENTS']: '/cms/news/comments/:id',
      ['CREATE_COMMENTS']: '/cms/news/comments/create',
      ['UPDATE_COMMENTS']: '/cms/news/comments/update',
      ['DELETE_COMMENTS']: '/cms/news/comments/delete',
    },
    USER: {
      ['CHANGE_PASSWORD']: '/cms/user/change_password',
      ['CREATE_ACCOUNT_MEMBER']: '/cms/user/create_account_member',
      ['IMPORT']: '/cms/user/import',
      ['DETAIL_ADMIN']: '/cms/user/detail',
      ['CHANGE_INFO']: '/cms/user/change_info',
      ['UPLOAD_IMAGE']: '/cms/user/upload_image',
      // member
      ['GET_ALL']: '/cms/members/all',
      ['CREATE_COMMENT']: '/cms/members/news/:newsId/comment',
      ['DELETE_COMMENT']: '/cms/members/news/comment/delete/:id',
      ['UPDATE_COMMENT']: '/cms/members/news/comment/update/:id',
      // outstanding
      ['GET_ALL_OUTSTANDING']: '/cms/members/get_all_outstanding',
    },
  },
  MEMBER: {
    USER: {
      ['CHANGE_PASSWORD']: '/landing-page/user/change_password',
      ['FORGOT_PASSWORD']: '/landing-page/user/forgot_password',
      ['RESET_PASSWORD']:
        '/landing-page/user/reset_password/:user_id/:unique_string',
      ['DETAIL_MEMBER']: '/landing-page/user/detail',
      ['CHANGE_INFO']: '/landing-page/user/change_info',
      ['UPLOAD_IMAGE']: '/landing-page/user/upload_image',
      // member
      ['GET_ALL']: '/landing-page/members/all',
      ['GET_ALL_OUTSTANDING']: '/landing-page/members/get_all_outstanding',
    },
    NEWS: {
      ['GET_BY_ID']: '/landing-page/news/:id',
      ['GET_ALL']: '/landing-page/news',
      ['GET_COMMENTS']: '/landing-page/news/comments/:id',
      ['CREATE_COMMENT']: '/landing-page/news/comments/create',
      ['DELETE_COMMENT']: '/landing-page/news/comments/delete',
      ['UPDATE_COMMENT']: '/landing-page/news/comments/update',
    },
    SKILL: {
      ['GET_ALL']: '/landing-page/skills/all',
    },
    BAND: {
      ['GET_ALL']: '/landing-page/bands',
    },
  },
  LOGIN: {
    ['SING_IN']: '/user/sing_in',
  },
};

module.exports = API;
