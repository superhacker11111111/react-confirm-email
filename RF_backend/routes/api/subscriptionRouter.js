const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const subscriptionController = require("../../controller/subscriptionController");

router.get("/", subscriptionController.getSubscriptionList);
router.post("/", subscriptionController.createSubscription);
router.get("/:id", subscriptionController.getSubscriptionByID);
router.put("/:id", [authToken], subscriptionController.updateSubscription);
router.put(
  "/delete/:id",
  [authToken],
  subscriptionController.deleteSubscription
);

module.exports = router;
