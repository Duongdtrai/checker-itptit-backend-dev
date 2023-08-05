const express = require('express');
const router = express.Router();
const API = require('../../api.constant');
const newsController = require('./news.controller');

router.post(API.MEMBER.NEWS.GET_ALL, newsController.getAll);
router.get(API.MEMBER.NEWS.GET_BY_ID, newsController.getById);

router.get(API.MEMBER.NEWS.GET_COMMENTS, newsController.getNewsComments);
router.post(API.MEMBER.NEWS.CREATE_COMMENT, newsController.createComment);
router.put(API.MEMBER.NEWS.UPDATE_COMMENT, newsController.updateComment);
router.put(API.MEMBER.NEWS.DELETE_COMMENT, newsController.deleteComment);
module.exports = router;
