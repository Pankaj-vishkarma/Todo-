const express = require('express');
const {register,login,refreshAccessToken,logout} = require('../controller/userCtrl.js');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;