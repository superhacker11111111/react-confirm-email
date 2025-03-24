const express = require("express");
const router = express.Router();
const tagController = require("../../controller/tagController");

router.put("/", tagController.updateTags);
router.get("/", tagController.getTags);

module.exports = router;
