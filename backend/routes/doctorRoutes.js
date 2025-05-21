const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  registerDoctor,
  loginDoctor,
  updateDoctor,
  getDoctorProfile ,
  updateDoctorProfile
} = require("../controllers/doctorController");
const {
  doctorGoogleLogin,
} = require("../controllers/doctorGoogleAuthController");
const { authenticateDoctor } = require("../middleware/authMiddleware");

router.post("/google-login", doctorGoogleLogin);
router.post("/doctor/register", registerDoctor);
router.post("/doctor/login", loginDoctor);

router.get("/doctors", getAllDoctors);

router.get("/doctor/profile", authenticateDoctor, getDoctorProfile);
router.put("/doctor/profile", authenticateDoctor, updateDoctorProfile);

router.put("/doctor/:id", authenticateDoctor, updateDoctor);

module.exports = router;
