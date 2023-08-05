const express = require('express');
const router = express.Router();

const routerUser = require('./user/user.router');
const routerNews = require('./news/news.router');
const routerSkill = require('./skill/skill.router');
const routerBand = require('./band/band.router');

/** router User */
router.use(routerUser);

/** router News */
router.use(routerNews);

/** router skill */
router.use(routerSkill);

/** router band */
router.use(routerBand);

module.exports = router;
