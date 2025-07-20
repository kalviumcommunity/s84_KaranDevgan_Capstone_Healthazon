const bcrypt = require("bcrypt");
const path = require("path");
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
  try {
    const {
      name,
      email,
      password,
      fees,
      specialization,
      experience,
      location,
    } = req.body;

    // Parse arrays correctly (FormData sends them as strings)
    const availableDays = req.body.availableDays
      ? req.body.availableDays.split(",").map((d) => d.trim())
      : [];

    const languagesSpoken = req.body.languagesSpoken
      ? req.body.languagesSpoken.split(",").map((l) => l.trim())
      : [];

    // Check existing doctor
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile image if uploaded
    const profileImagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

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
      profileImage: profileImagePath,
    });

    await newDoctor.save();

    const doctorToSend = newDoctor.toObject();
    delete doctorToSend.password;

    return res.status(201).json({
      message: "Doctor registered successfully",
      doctor: doctorToSend,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
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

async function getDoctorProfile(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const doc = req.user.toObject();
  delete doc.password;
  res.json({ doctor: doc });
}

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const updates = req.body;

    if (req.file) {
      updates.profileImage = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    // For array fields from form, convert if sent as strings (optional)
    if (typeof updates.languagesSpoken === "string") {
      updates.languagesSpoken = updates.languagesSpoken
        .split(",")
        .map((s) => s.trim());
    }
    if (typeof updates.availableDays === "string") {
      updates.availableDays = updates.availableDays
        .split(",")
        .map((s) => s.trim());
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", doctor: updatedDoctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllDoctors,
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
};
