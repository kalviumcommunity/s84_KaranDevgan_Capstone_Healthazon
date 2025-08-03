const express = require("express");
const router = express.Router();
const { sendOtp, resetPassword } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
