const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/doctor", async (req, res) => {
  const {
    name,
    email,
    password,
    fees,
    specialization,
    experience,
    availability,
    profileImage,
  } = req.body;

  try {

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword, 
      fees,
      specialization,
      experience,
      availability,
      profileImage,
    });

    await newDoctor.save();

    
    const doctorToSend = newDoctor.toObject();
    delete doctorToSend.password;

    
    res
      .status(201)
      .json({
        message: "Doctor registered successfully",
        doctor: doctorToSend,
      });
  } catch (error) {
    
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
  

module.exports = router;