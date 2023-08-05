const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const skillController = require('./skill.controller');

router.get(API.MEMBER.SKILL.GET_ALL, skillController.getAll);

module.exports = router;
