const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const organizationController = require('./organization.controller');

router.get(API.ADMIN.ORGANIZATION.GET_BY_ID, organizationController.getById);
router.post(API.ADMIN.ORGANIZATION.CREATE, organizationController.create);
router.put(API.ADMIN.ORGANIZATION.UPDATE, organizationController.update);
router.put(API.ADMIN.ORGANIZATION.DELETE, organizationController.delete);

module.exports = router;
