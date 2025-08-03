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

router.get("/", getAllApprovedDoctors); // GET /api/doctors
router.put("/profile", protect, restrictTo("doctor"), updateDoctorProfile); // PUT /api/doctors/profile
router.get("/me", protect, restrictTo("doctor"), getDoctorSelfInfo); // GET /api/doctors/me
router.get("/:id", getDoctorById); // GET /api/doctors/:id

router.put("/status", protect, updateDoctorStatus); // PUT /api/doctors/status

export default router;
