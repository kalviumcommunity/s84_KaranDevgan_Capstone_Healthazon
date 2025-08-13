import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  ForgotPassWord,
  ResetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // middleware for protected routes

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Password-reste routes
router.post("/forgot-password", ForgotPassWord);
router.post("/reset-password/:token", ResetPassword);
// Protected Routes
router.get("/current", protect, getCurrentUser);
router.put("/profile", protect, updateUserProfile);

export default router;
