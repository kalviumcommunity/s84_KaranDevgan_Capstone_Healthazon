const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

    const doctorToSend = { ...newDoctor._doc };
    delete doctorToSend.password;

    return res.status(201).json({
      message: "Doctor registered successfully",
      doctor: doctorToSend,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

router.put("/doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const updatedData = { ...req.body };

    // If password is being updated, hash it
    if (updatedData.password) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(
        updatedData.password,
        saltRounds
      );
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor updated", doctor: updatedDoctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;