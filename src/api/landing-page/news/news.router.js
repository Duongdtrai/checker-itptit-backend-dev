const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const newsController = require('./news.controller');

router.get(API.ADMIN.NEWS.GET_BY_ID, newsController.getById);
router.get(API.ADMIN.NEWS.GET_ALL, newsController.getAll);
router.post(API.ADMIN.NEWS.CREATE, newsController.create);
router.put(API.ADMIN.NEWS.UPDATE, newsController.update);
router.put(API.ADMIN.NEWS.DELETE, newsController.delete);
router.get(API.ADMIN.NEWS.GET_COMMENTS, newsController.getNewsComments);

module.exports = router;
