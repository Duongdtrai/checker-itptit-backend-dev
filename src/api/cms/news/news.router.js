const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const newsController = require('./news.controller');

router.get(API.ADMIN.NEWS.GET_BY_ID, newsController.getById);
router.post(API.ADMIN.NEWS.GET_ALL, newsController.getAllNews);
router.post(API.ADMIN.NEWS.CREATE, newsController.create);
router.put(API.ADMIN.NEWS.UPDATE, newsController.update);
router.put(API.ADMIN.NEWS.DELETE, newsController.delete);
router.post(API.ADMIN.NEWS.UPLOAD_THUMBNAIL, newsController.uploadThumbnail);

router.get(API.ADMIN.NEWS.GET_COMMENTS, newsController.getNewsComments);
router.post(API.ADMIN.NEWS.CREATE_COMMENTS, newsController.createNewsComments);
router.put(API.ADMIN.NEWS.UPDATE_COMMENTS, newsController.updateNewsComments);
router.put(API.ADMIN.NEWS.DELETE_COMMENTS, newsController.deleteNewsComments);
module.exports = router;
