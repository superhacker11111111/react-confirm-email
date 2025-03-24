const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const edController = require("../../controller/edController");

router.get("/", edController.getEDList);
router.post("/", edController.createED);
router.get("/:id", [authToken], edController.getEDByID);
router.put("/:id", [authToken], edController.updateED);
router.put("/delete/:id", [authToken], edController.deleteED);

module.exports = router;
