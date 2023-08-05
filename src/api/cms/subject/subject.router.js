const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const subjectController = require('./subject.controller');

router.get(API.ADMIN.SUBJECT.GET_ALL, subjectController.getAll);
router.get(API.ADMIN.SUBJECT.GET_BY_ID, subjectController.getById);
router.post(API.ADMIN.SUBJECT.CREATE, subjectController.create);
router.put(API.ADMIN.SUBJECT.UPDATE, subjectController.update);
router.put(API.ADMIN.SUBJECT.DELETE, subjectController.delete);

module.exports = router;
