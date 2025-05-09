// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;