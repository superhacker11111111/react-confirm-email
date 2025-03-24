const express = require('express');
const router = express.Router();
const serviceController = require('../../controller/serviceController');

router.post('/', serviceController.sendMessage);
router.post('/sendViewPriceMessage', serviceController.sendViewPriceMessage);
router.post('/sendAnnounceMessage', serviceController.sendNews);

module.exports = router;
