const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const leadsourceController = require("../../controller/leadsourceController");

router.get("/", leadsourceController.getLeadSourceList);
router.post("/", leadsourceController.createLeadSource);
router.put("/delete/:id", leadsourceController.deleteLeadSource);
router.put("/multidelete", leadsourceController.deletemultiLeadSource);

module.exports = router;
