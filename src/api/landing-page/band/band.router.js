const express = require('express');
const router = express.Router();
const bandController = require('./band.controller');
const API = require('../../api.constant');

router.get(API.ADMIN.BAND.GET_ALL, bandController.getBands);
router.get(API.ADMIN.BAND.GET_BY_ID, bandController.getBandById);
router.post(API.ADMIN.BAND.CREATE, bandController.createBand);
router.put(API.ADMIN.BAND.UPDATE, bandController.updateBand);
router.put(API.ADMIN.BAND.DELETE, bandController.deleteBand);

module.exports = router;
