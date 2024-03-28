const express = require('express');
const verifyToken = require('../middleware/authMiddleware.js');
const mainGet = require('../controllers/mainController.js');
const router = express.Router();
router.get("/main", verifyToken, mainGet);

module.exports = router;