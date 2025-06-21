const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  registerDoctor,
  loginDoctor,
  updateDoctor,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");

const {
  doctorGoogleLogin,
} = require("../controllers/doctorGoogleAuthController");

const { authenticateDoctor } = require("../middleware/authMiddleware");

// Google login
router.post("/google-login", doctorGoogleLogin);

// Registration and login
router.post("/doctor/register", registerDoctor);
router.post("/doctor/login", loginDoctor);

// Public listing of all doctors with filters
router.get("/doctors", getAllDoctors);

// Doctor profile (protected)
router.get("/doctor/profile", authenticateDoctor, getDoctorProfile);
router.put("/doctor/profile", authenticateDoctor, updateDoctorProfile);

// Admin-style update route (e.g. for future admin panel or profile updates)
router.put("/doctor/:id", authenticateDoctor, updateDoctor);

module.exports = router;
