import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import transporter from "../config/emailConfig.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email");
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        message: "Registration successful.",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500);
    throw new Error("Server error during registration");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please enter both email and password");
    }

    const user = await User.findOne({ email });
    if (!user)
      res.status(400).json({ message: "This email is not registered" });
    if (!user.matchPassword(password))
      res.status(400).json({ message: "Invalid password" });
    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful.",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500);
    throw new Error("Backend error during login");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Fetch Current User Error:", error.message);
    res.status(500);
    throw new Error("Server error while fetching current user");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.contact = req.body.contact || user.contact;
    user.address = req.body.address || user.address;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully.",
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500);
    throw new Error("Server error while updating profile");
  }
});

export const ForgotPassWord = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No account found with this email address");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Healthazon - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Reset Your Healthazon Password</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset the password for your Healthazon account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3498db; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #7f8c8d; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #7f8c8d; font-size: 14px;">
            If you didn't request this password reset, please ignore this email. 
            Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;">
          <p style="color: #95a5a6; font-size: 12px;">
            This is an automated message from Healthazon. Please do not reply to this email.
          </p>
        </div>
    `,
    };
     await transporter.sendMail(mailOptions);
     res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    
    res.status(500);
    throw new Error("Backend error" , error);
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    
    if (!password) {
      res.status(400);
      throw new Error("Password is required");
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters long");
    }

    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

if (!user) {
  res.status(400);
  throw new Error("Invalid or expired password reset token");
}
    
    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500);
    throw new Error("Server error while resetting password", error);
  }
};
