const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const periodController = require('./period.controller');

router.get(API.ADMIN.PERIOD.GET_BY_ID, periodController.getById);
router.post(API.ADMIN.PERIOD.CREATE, periodController.create);
router.put(API.ADMIN.PERIOD.UPDATE, periodController.update);

module.exports = router;
