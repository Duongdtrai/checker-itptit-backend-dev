const express = require('express');
const router = express.Router();
const memberController = require('./member.controller');
const API = require('../../api.constant');

router.get(API.ADMIN.MEMBER.GET_ALL, memberController.getAllMembers);
router.post(API.ADMIN.MEMBER.CREATE, memberController.createMember);
router.post(API.ADMIN.MEMBER.CREATE_COMMENT, memberController.createComment);
router.put(API.ADMIN.MEMBER.DELETE_COMMENT, memberController.deleteComment);
router.put(API.ADMIN.MEMBER.UPDATE_COMMENT, memberController.updateComment);

module.exports = router;
