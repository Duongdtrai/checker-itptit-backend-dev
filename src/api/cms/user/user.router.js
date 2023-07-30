const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const userController = require('./user.controller');
const formidable = require('formidable');

/** API for cms */
router.get(API.ADMIN.USER.DETAIL_ADMIN, userController.getDetailAdmin);
router.post(API.ADMIN.USER.LOGIN, userController.loginCMS);
router.post(API.ADMIN.USER.CHANGE_PASSWORD, userController.changePasswordCMS);
router.post(
  API.ADMIN.USER.CREATE_ACCOUNT_MEMBER,
  userController.createAccountMember
);
router.put(API.ADMIN.USER.CHANGE_INFO, userController.changeInfoAdmin);
router.post(
  API.ADMIN.USER.IMPORT,
  (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, file) => {
      if (err) {
        next(err);
        return;
      }
      req.fields = fields;
      req.file = file;
      next();
    });
  },
  userController.importUser
);

router.post(API.ADMIN.USER.UPLOAD_IMAGE, userController.uploadImage);
router.get(API.ADMIN.USER.GET_ALL, userController.getAllMembers);
router.post(API.ADMIN.USER.CREATE_COMMENT, userController.createComment);
router.put(API.ADMIN.USER.DELETE_COMMENT, userController.deleteComment);
router.put(API.ADMIN.USER.UPDATE_COMMENT, userController.updateComment);

module.exports = router;
