// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Patient = require("../models/Patient");

router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/patient", async (req, res) => {
  const { name, email, password, age, gender, medicalReports, profileImage } =
    req.body;

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      medicalReports,
      profileImage,
    });

    await newPatient.save();

    const patientToSend = { ...newPatient._doc };
    delete patientToSend.password;

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      patient: patientToSend,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});
  


module.exports = router;