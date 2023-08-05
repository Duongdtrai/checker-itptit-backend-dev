const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const skillController = require('./skill.controller');

router.get(API.ADMIN.SKILL.GET_ALL, skillController.getAll);
router.get(API.ADMIN.SKILL.GET_BY_ID, skillController.getById);
router.post(API.ADMIN.SKILL.CREATE, skillController.create);
router.put(API.ADMIN.SKILL.UPDATE, skillController.update);
router.put(API.ADMIN.SKILL.DELETE, skillController.delete);

module.exports = router;
