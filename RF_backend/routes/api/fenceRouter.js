const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const fenceController = require("../../controller/fenceController");

router.get("/", fenceController.getFenceList);
router.get("/findby/:id", fenceController.getFenceListByName);
router.get("/:id", fenceController.getFenceById);
router.get("/category/:id", fenceController.getFenceByCategoryId);
// router.post("/:id", fenceController.getFenceId);
router.put("/:productid", fenceController.updateFence);
router.post("/update/visible", fenceController.updateFenceVisible);
router.post("/update/status", fenceController.updateFenceStatus);
router.post("/", fenceController.createFence);
router.put("/delete/:id", fenceController.deleteFence);
router.post("/getCategories/", fenceController.getSelectableElements);
router.get("/selected/list/", [authToken], fenceController.getFencesByUserId);
router.get("/getRequest/:userId", fenceController.getRequestFencesByUser);
router.get("/getFences/visible", fenceController.getVisibleFences);
router.get("/assetRequests/getAll", fenceController.getAssetRequests);
router.get("/assetRequests/get/:id", fenceController.getAssetRequest);
router.put("/assetRequest/delete/:id", fenceController.deleteAssetRequest);
router.get("/assetRequest/get/:id", fenceController.getAssetRequestById);
router.post("/assetRequests/delete", fenceController.deleteAssetRequests);

module.exports = router;
