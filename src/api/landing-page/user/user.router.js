const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const userController = require('./user.controller');

router.get(API.MEMBER.USER.DETAIL_MEMBER, userController.getDetailMemberLP);
router.post(API.MEMBER.USER.CHANGE_PASSWORD, userController.changePasswordLP);
router.put(API.MEMBER.USER.CHANGE_INFO, userController.changeInfoMember);
router.post(API.MEMBER.USER.FORGOT_PASSWORD, userController.forgotPasswordLP);
router.get(API.MEMBER.USER.RESET_PASSWORD, userController.resetPasswordLP);
router.post(API.MEMBER.USER.RESET_PASSWORD, userController.resetPasswordPostLP);
router.post(API.MEMBER.USER.UPLOAD_IMAGE, userController.uploadImage);

router.post(API.MEMBER.USER.GET_ALL, userController.getAllMembers);
router.get(
  API.MEMBER.USER.GET_ALL_OUTSTANDING,
  userController.getAllOutStanding
);
router.post(API.LOGIN.SING_IN, userController.loginLP);
module.exports = router;
