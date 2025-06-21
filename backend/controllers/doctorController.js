const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

async function getAllDoctors(req, res) {
  try {
    const query = {};

    if (req.query.specialization)
      query.specialization = req.query.specialization;

    if (req.query.fees) query.fees = { $lte: Number(req.query.fees) };

    if (req.query.location) query.location = req.query.location;

    if (req.query.experience)
      query.experience = { $gte: Number(req.query.experience) };

    if (req.query.availableDay) {
      const days = req.query.availableDay.split(",");
      query.availableDays = { $in: days };
    }

    if (req.query.language) {
      const langs = req.query.language.split(",");
      query.languagesSpoken = { $in: langs };
    }

    const doctors = await Doctor.find(query);
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function registerDoctor(req, res) {
  const {
    name,
    email,
    password,
    fees,
    specialization,
    experience,
    location,
    availableDays,
    languagesSpoken,
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
      location,
      availableDays,
      languagesSpoken,
      profileImage,
    });

    await newDoctor.save();

    const doctorToSend = newDoctor.toObject();
    delete doctorToSend.password;

    return res.status(201).json({
      message: "Doctor registered successfully",
      doctor: doctorToSend,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function loginDoctor(req, res) {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (doctor.isGoogleUser) {
      return res.status(400).json({
        message:
          "This account is linked with Google. Please login using Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const doctorData = doctor.toObject();
    delete doctorData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      doctor: doctorData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updateDoctor(req, res) {
  try {
    const doctorId = req.params.id;
    const updatedData = { ...req.body };

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorToSend = updatedDoctor.toObject();
    delete doctorToSend.password;

    return res.status(200).json({
      message: "Doctor updated",
      doctor: doctorToSend,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getDoctorProfile(req, res) {
  const doc = req.user.toObject();
  delete doc.password;
  res.json({ doctor: doc });
}

async function updateDoctorProfile(req, res) {
  try {
    const doctor = req.user;
    const {
      name,
      specialization,
      fees,
      profileImage,
      location,
      experience,
      availableDays,
      languagesSpoken,
    } = req.body;

    if (name !== undefined) doctor.name = name;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (fees !== undefined) doctor.fees = fees;
    if (profileImage !== undefined) doctor.profileImage = profileImage;
    if (location !== undefined) doctor.location = location;
    if (experience !== undefined) doctor.experience = experience;
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (languagesSpoken !== undefined) doctor.languagesSpoken = languagesSpoken;

    await doctor.save();

    const updated = doctor.toObject();
    delete updated.password;
    res.json({ message: "Profile updated", doctor: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getAllDoctors,
  registerDoctor,
  loginDoctor,
  updateDoctor,
  getDoctorProfile,
  updateDoctorProfile,
};
