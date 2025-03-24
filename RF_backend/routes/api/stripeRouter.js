const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const stripeController = require("../../controller/stripeController");

router.get("/create-payment-intent", stripeController.createPaymentIntent);
router.post("/create-payment-method", stripeController.createPaymentMethod);
router.post("/create-customer", stripeController.createCustomer);
router.post("/attach-payment-method", stripeController.attachPaymentMethod);
router.post("/create-price", stripeController.createPrice);
router.post("/retrieve-price", stripeController.retrievePrice);
router.post("/create-subscription", stripeController.createSubscription);
router.post("/add-paymentmethod", stripeController.addPaymentMethod);
router.post("/get-paymentmethod-info", stripeController.getPaymentMethodInfo);
router.post("/detach-paymentmethod", stripeController.detachPaymentMethod);
router.post("/subscription/update", stripeController.updateSubscription);
router.post("/retrieve-subscription", stripeController.retrieveSubscription);
router.post("/cancel-subscription", stripeController.cancelSubscription);
router.post(
  "/customer-listpaymentmethod",
  stripeController.customerListPaymentMethod
);
router.post("/synctime", stripeController.syncTime);
router.post("/additional-charge", stripeController.additionalCharge);
router.post("/credit-balance", stripeController.customerCreditBalance);

module.exports = router;
