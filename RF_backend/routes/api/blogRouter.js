const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const blogController = require("../../controller/blogController");

router.get("/", blogController.getBlogList);
router.post("/", blogController.createBlog);
router.get("/:id", blogController.getBlogByID);
router.put("/:id", [authToken], blogController.updateBlog);
router.put("/delete/:id", [authToken], blogController.deleteBlog);

module.exports = router;
