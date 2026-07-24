const express = require("express");
const authController = require("../controller/authController");
const router=express.Router();

router.post("/sent/login-signup-otp",authController.sendLoginOtp)
module.exports=router;