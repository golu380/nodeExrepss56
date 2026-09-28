const express = require('express');

const {registerUser, loginUser,loginUserr} = require("../Controlers/AuthControlers")

const router = express.Router();



router.post('/register',registerUser)
// router.post('/login',loginUser)
router.post('/loginn',loginUserr)

module.exports = router;
