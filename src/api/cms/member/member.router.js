const express = require('express');
const router = express.Router();
const memberController = require('./member.controller');
const API = require('../../api.constant');

router.get(API.ADMIN.MEMBER.GET_ALL, memberController.getAllMembers);
router.post(API.ADMIN.MEMBER.CREATE, memberController.createMember);
router.post(API.ADMIN.MEMBER.ADD_BAND, memberController.addBand);
router.put(API.ADMIN.MEMBER.DELETE_BAND, memberController.deleteBand);
router.post(API.ADMIN.MEMBER.ADD_SKILL, memberController.addSkill);
router.put(API.ADMIN.MEMBER.DELETE_SKILL, memberController.deleteSkill);

module.exports = router;
