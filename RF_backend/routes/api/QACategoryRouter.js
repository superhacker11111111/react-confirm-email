const express = require("express");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const QACategoryController = require("../../controller/QACategoryController");

router.get("/", QACategoryController.getCategoryList);
router.post("/", QACategoryController.createCategory);
router.get("/:id", [authToken], QACategoryController.getCategoryByID);
router.put("/:id", [authToken], QACategoryController.updateCategory);
router.put("/delete/:id", [authToken], QACategoryController.deleteCategory);

module.exports = router;
