const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const categoryController = require("../../controller/categoryController");

router.post("/", [authToken], categoryController.createCategory);
router.get("/:id", categoryController.getCategoryByName);
router.get("/", categoryController.getCategoryList);
router.put("/:id", [authToken], categoryController.updateCategory);
router.put("/delete/:id", [authToken], categoryController.deleteCategory);
router.post("/deletes", [authToken], categoryController.deleteCategorys);
router.get("/styles/all", categoryController.getStyles);
router.post("/styles", categoryController.getStylesByName);

module.exports = router;
