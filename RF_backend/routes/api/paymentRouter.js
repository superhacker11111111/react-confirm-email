const express = require("express");
const router = express.Router();
const paymentController = require("../../controller/paymentController");

router.post("/billing", paymentController.getBillingList);
router.post("/billing/detail", paymentController.getBillingDetail);

module.exports = router;
