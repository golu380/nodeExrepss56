const express = require('express');

const {registerUser, loginUser,forgotPassword,verifyEmail} = require("../Controlers/AuthControlers")

const router = express.Router();
const authenticate  = require('../middleware/AuthMiddleware');



router.post('/register',registerUser)
router.get("/verify-email/:token", verifyEmail); 
router.post('/login',loginUser)
// router.post('/loginn',loginUserr)
// router.get('/profile', authenticate, getProfile)
router.post('/forgot-password',forgotPassword)

module.exports = router;
