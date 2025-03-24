const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const adminController = require("../../controller/adminController");

router.post("/signin", adminController.adminLogin);
router.post("/resendCode", adminController.resendCode);
router.post("/verify", adminController.verify);
router.post("/phoneVerify", adminController.phoneVerify);
// forgot password
router.post("/forgotpassword", adminController.forgotPassword);
router.post("/resetPassword", [authToken], adminController.resetPassword);
router.post("/createPassword", adminController.createPassword);
// admin
router.get("/:id", adminController.getUserByID);
router.get("/", [authToken], adminController.getAdmins);
router.post("/", [authToken], adminController.addAdmin);
router.put("/:id", [authToken], adminController.deleteAdmin);

module.exports = router;
