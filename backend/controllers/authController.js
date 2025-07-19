const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const sendMail = require("../utils/mailer");

exports.sendOtp = async(req , res) => {
    const {email , userType} = req.body;
    if(!email || !userType) {
        return res.status(400).json({message: "Email and user type are required"});
    }
    const User = userType === "doctor" ? Doctor : Patient;
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found with this email`});
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry 
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    try {
        await sendMail({
            to: user.email,
            subject: "Your OTP Code",
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
        });
        return res.status(200).json({message: "OTP sent successfully"});
    }
 catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: "Failed to send OTP" });

    }    };
    

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, userType } = req.body;

  if (!email || !otp || !newPassword || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const User = userType === "doctor" ? Doctor : Patient;
  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiry ||
    user.otpExpiry < new Date()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};
