// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/patient/register", async (req, res) => {
    
  try {
    const { name, email, password, age, gender, medicalReports, profileImage } =
      req.body;

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

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      patient: patientToSend,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
});
  


router.post("/patient/login", async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }
       
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...patientData } = patient.toObject();
 
  return res.status(200).json({
  message: "Login successful",
  token,
 patient: patientData
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/patient/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const updatedData = { ...req.body };

    
    if (updatedData.password) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(
        updatedData.password,
        saltRounds
      );
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientToSend = { ...updatedPatient._doc };
    delete patientToSend.password;

     return res
      .status(200)
      .json({ message: "Patient updated", patient: patientToSend });
  } catch (error) {
     return res.status(400).json({ message: error.message });
  }
});



module.exports = router;