const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const outstandingController = require('./outstanding-member.controller');

router.get(API.ADMIN.OUTSTANDING_MEMBER.GET_ALL, outstandingController.getAll);
router.post(API.ADMIN.OUTSTANDING_MEMBER.CREATE, outstandingController.create);
router.put(API.ADMIN.OUTSTANDING_MEMBER.UPDATE, outstandingController.update);
router.put(API.ADMIN.OUTSTANDING_MEMBER.DELETE, outstandingController.delete);

module.exports = router;
