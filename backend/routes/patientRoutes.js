const express = require("express");
const router = express.Router();
const {
  patientGoogleLogin,
} = require("../controllers/patientGoogleAuthController");

const {
  getAllPatients,
  registerPatient,
  loginPatient,
  updatePatient,
  updatePatientProfile ,
  getPatientProfile
} = require("../controllers/patientController");
const { authenticatePatient } = require("../middleware/authMiddleware");

router.get("/patients", getAllPatients);
router.post("/patient/register", registerPatient);
router.post("/patient/login", loginPatient);
router.post("/patient/google-login", patientGoogleLogin);

router.get("/patient/profile", authenticatePatient, getPatientProfile);
router.put("/patient/profile" , authenticatePatient , updatePatientProfile);

router.put("/patient/:id", updatePatient);

module.exports = router;
