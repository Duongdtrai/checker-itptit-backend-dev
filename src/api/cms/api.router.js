const express = require('express');
const router = express.Router();

const routerUser = require('./user/user.router');
const routerBand = require('./band/band.router');
const routerNews = require('./news/news.router');
const routerPeriod = require('./period/period.router');
const routerSkill = require('./skill/skill.router');

/** router User */
router.use(routerUser);

/** router Band */
router.use(routerBand);

/** router News */
router.use(routerNews);

/** router Period */
router.use(routerPeriod);

/** router Period */
router.use(routerSkill);

module.exports = router;
