const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const userController = require("../../controller/userController");

router.get("/", [authToken], userController.getUserList);
router.post("/", userController.createUser);
router.get("/:id", [authToken], userController.getUserByID);
router.put("/info/:id", [authToken], userController.updateInfoUser);
router.put("/:id", [authToken], userController.updateUser);
router.put("/updateFences/:id", userController.updateUserFence);
router.post("/changepassword/:id", [authToken], userController.changePassword);
router.put("/delete/:id", [authToken], userController.deleteUser);
router.put("/account/delete/:id", [authToken], userController.deleteAccount);
router.put(
  "/deleteByEmail/:email",
  [authToken],
  userController.deleteUserByEmail
);

router.put("/users/delete", [authToken], userController.deleteUsers);
router.put(
  "/users/deleteByEmail",
  [authToken],
  userController.deleteUsersByEmail
);
router.post("/createProfile", [authToken], userController.createProfile);
router.post("/createEndpoint/:id", [authToken], userController.createEndpoint);
// notifications
router.post(
  "/sendFenceNotification",
  userController.sendFenceUpdateNotification
);
router.post(
  "/filemanagerNotification",
  userController.sendFileManagerNotification
);

router.post("/addUsers/:id", userController.addUsersByUser);
router.get("/companies/all", [authToken], userController.getCompanyList);
router.get("/companies/file", [authToken], userController.getCompany);
router.get("/company/fileList", [authToken], userController.getCompanyFileList);
router.get("/shopper/all", [authToken], userController.getShopperList);
router.get("/admins/all", [authToken], userController.getAdminList);
router.put("/admin/:id", [authToken], userController.addAdmins);
router.post("/company", [authToken], userController.addCompany);
router.post("/get/parentId", [authToken], userController.getUsersByParentId);
router.put("/deleteCompany/:id", [authToken], userController.deleteCompany);

// get all user information for iOS app
router.get(
  "/getAllIOS/:id",
  [authToken],
  userController.getAllInformationForApp
);

// country and state list for shopper list filter on admin portal
router.get("/getAll/country/state", userController.getCountryAndStateList);

// update user account info on admin portal
router.put("/update/account/:id", [authToken], userController.updateAccount);

// exist email check
router.post("/existEmailCheck", userController.isExistEmail);
router.post("/shopperEmailExistCheck", userController.shopperEmailExistCheck);

router.post("/emailSendTest", userController.emailTest);

module.exports = router;
