// backend/routes/doctorRoutes.js

import express from "express";
import {
  getAllApprovedDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorSelfInfo,
  updateDoctorStatus,
} from "../controllers/doctorController.js";

import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllApprovedDoctors); 
router.put("/profile", protect, restrictTo("doctor"), updateDoctorProfile); 
router.get("/me", protect, restrictTo("doctor"), getDoctorSelfInfo); 
router.get("/:id", getDoctorById); 

router.put("/status", protect, updateDoctorStatus); 

export default router;
