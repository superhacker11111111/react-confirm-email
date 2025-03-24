const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");

router.post("/", userController.createEndpoint);

module.exports = router;
