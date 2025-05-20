const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  registerDoctor,
  loginDoctor,
  updateDoctor,
} = require("../controllers/doctorController");
const {
  doctorGoogleLogin,
} = require("../controllers/doctorGoogleAuthController");

router.post("/google-login", doctorGoogleLogin);

router.get("/doctors", getAllDoctors);
router.post("/doctor/register", registerDoctor);
router.post("/doctor/login", loginDoctor);
router.put("/doctor/:id", updateDoctor);
  

module.exports = router;
