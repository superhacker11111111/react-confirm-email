const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const mediaController = require("../../controller/mediaController");

router.post("/video", [authToken], mediaController.createOrUpdateVideo);
router.get("/video", mediaController.getVideos);

router.get("/gallery", mediaController.getAllImages);
router.post("/gallery", [authToken], mediaController.createImages);
router.put("/gallery/:id", [authToken], mediaController.deleteImage);

module.exports = router;
