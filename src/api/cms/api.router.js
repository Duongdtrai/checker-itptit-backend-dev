const express = require('express');
const router = express.Router();

const routerUser = require('./user/user.router');
const routerBand = require('./band/band.router')
const routerMember = require('./member/member.router')
const routerNews = require('./news/news.router')
const routerOutstandingMember = require('./outstanding-member/outstanding-member.router')
const routerPeriod = require('./period/period.router')
const routerSkill = require('./skill/skill.router')
const routerThumbnail = require('./thumbnail/thumbnail.router')

/** router User */
router.use(routerUser)

/** router Band */
router.use(routerBand)

/** router Member */
router.use(routerMember)

/** router News */
router.use(routerNews)

/** router Outstanding Member */
router.use(routerOutstandingMember)

/** router Period */
router.use(routerPeriod)

/** router Period */
router.use(routerSkill)

/** router Thumbnail */
router.use(routerThumbnail)

module.exports = router;
