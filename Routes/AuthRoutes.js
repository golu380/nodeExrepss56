const express = require('express');

const {registerUser, loginUser,loginUserr,getProfile} = require("../Controlers/AuthControlers")

const router = express.Router();
const authenticate  = require('../middleware/AuthMiddleware');



router.post('/register',registerUser)
// router.post('/login',loginUser)
router.post('/loginn',loginUserr)
router.get('/profile', authenticate, getProfile)

module.exports = router;
