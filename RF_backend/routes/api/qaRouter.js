const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const QAController = require("../../controller/qaController");

router.get("/", QAController.getQAList);
router.post("/", QAController.createQA);
router.get("/:id", [authToken], QAController.getQAByID);
router.put("/:id", [authToken], QAController.updateQA);
router.put("/delete/:id", [authToken], QAController.deleteQA);

module.exports = router;
