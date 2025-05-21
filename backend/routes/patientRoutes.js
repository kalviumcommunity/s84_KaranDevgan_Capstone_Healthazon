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
} = require("../controllers/patientController");

router.get("/patients", getAllPatients);
router.post("/patient/register", registerPatient);
router.post("/patient/login", loginPatient);
router.put("/patient/:id", updatePatient);

router.post("/patient/google-login", patientGoogleLogin);
module.exports = router;
