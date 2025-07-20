// controllers/patientController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

async function getAllPatients(req, res) {
  try {
    const patients = await Patient.find().select("-password");
    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPatientProfile(req, res) {
  // req.user was set by authenticatePatient
  const patient = req.user.toObject();
  delete patient.password;
  res.json({ patient });
}

async function registerPatient(req, res) {
  const { name, email, password, age, gender, contact, profileImage } =
    req.body;

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      name,
      email,
      gender,
      password: hashedPassword,
      age,
      contact,
      profileImage,
    });

    await newPatient.save();

    const patientToSend = newPatient.toObject();
    delete patientToSend.password;

    return res.status(201).json({
      message: "Patient registered successfully",
      patient: patientToSend,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function loginPatient(req, res) {
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

    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const patientData = patient.toObject();
    delete patientData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      patient: patientData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updatePatient(req, res) {
  try {
    const patientId = req.params.id;
    const updatedData = { ...req.body };

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientToSend = updatedPatient.toObject();
    delete patientToSend.password;

    return res.status(200).json({
      message: "Patient updated",
      patient: patientToSend,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updatePatientProfile(req, res) {
  try {
    const patient = req.user; // from authenticatePatient middleware
    const { name, age, contact, email } = req.body;

    if (name !== undefined) patient.name = name;
    if (age !== undefined) patient.age = age;
    if (contact !== undefined) patient.contact = contact;
    if (email !== undefined && email !== patient.email) {
      const existing = await Patient.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      patient.email = email;
    }

    await patient.save();

    const result = patient.toObject();
    delete result.password;

    res.json({ message: "Profile updated", patient: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
module.exports = {
  getAllPatients,
  registerPatient,
  loginPatient,
  updatePatient,
  getPatientProfile,
  updatePatientProfile,
};
