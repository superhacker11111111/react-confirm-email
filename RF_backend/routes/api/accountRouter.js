const express = require('express');
const router = express.Router();
const authToken = require('../../middleware/authToken');
const userController = require('../../controller/userController');

router.get('/', [authToken], userController.getAccount);
router.put('/:id', [authToken], userController.updateAccount);

module.exports = router;
