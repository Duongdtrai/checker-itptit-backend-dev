const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const userController = require('./user.controller');

router.get(API.MEMBER.USER.DETAIL_MEMBER, userController.getDetailMemberLP);
router.post(API.MEMBER.USER.LOGIN, userController.loginLP);
router.post(API.MEMBER.USER.LOGIN, userController.changePasswordLP);
router.put(API.MEMBER.USER.CHANGE_INFO, userController.changeInfoMember);
router.post(API.MEMBER.USER.FORGOT_PASSWORD, userController.forgotPasswordLP);
router.get(API.MEMBER.USER.RESET_PASSWORD, userController.resetPasswordLP);
router.post(API.MEMBER.USER.RESET_PASSWORD, userController.resetPasswordPostLP);
router.post(API.MEMBER.USER.UPLOAD_IMAGE, userController.uploadImage);

module.exports = router;
