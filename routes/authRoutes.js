const express =require('express');
const {loginGet , loginPost , signupGet , signupPost} = require('../controllers/authController.js');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.js');
const mainGet = require('../controllers/mainController.js');

console.log(mainGet);

router.get("/", verifyToken, signupGet);

router.get("/login", verifyToken, loginGet);

router.post("/signup", signupPost);

router.post("/login",loginPost);

router.get("/main", verifyToken,mainGet);

module.exports = router;