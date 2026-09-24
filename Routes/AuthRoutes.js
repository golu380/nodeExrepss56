const express = require('express');

const {registerUser} = require("../Controlers/AuthControlers")

const router = express.Router();

router.post('/register',registerUser)

module.exports = router;
