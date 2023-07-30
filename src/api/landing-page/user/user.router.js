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

// Quỳnh code
router.get(API.MEMBER.USER.GET_ALL, userController.getAllMembers);
router.post(API.MEMBER.USER.CREATE_COMMENT, userController.createComment);
router.put(API.MEMBER.USER.DELETE_COMMENT, userController.deleteComment);
router.put(API.MEMBER.USER.UPDATE_COMMENT, userController.updateComment);
module.exports = router;
