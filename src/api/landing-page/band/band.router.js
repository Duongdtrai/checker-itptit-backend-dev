const express = require('express');
const router = express.Router();
const bandController = require('./band.controller');
const API = require('../../api.constant');

router.get(API.MEMBER.BAND.GET_ALL, bandController.getBands);

module.exports = router;
