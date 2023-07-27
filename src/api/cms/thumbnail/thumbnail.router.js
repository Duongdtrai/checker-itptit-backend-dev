const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const thumbnailController = require('./thumbnail.controller');

router.get(API.ADMIN.THUMBNAIL.GET_BY_ID, thumbnailController.getById);
router.post(API.ADMIN.THUMBNAIL.CREATE, thumbnailController.create);
router.put(API.ADMIN.THUMBNAIL.UPDATE, thumbnailController.update);
router.put(API.ADMIN.THUMBNAIL.DELETE, thumbnailController.delete);

module.exports = router;
