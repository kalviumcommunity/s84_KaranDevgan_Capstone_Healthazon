const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate a Doctor
const authenticateDoctor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const doctor = await Doctor.findById(decoded.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    req.user = doctor; // attach doctor info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to authenticate a Patient
const authenticatePatient = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "patient") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const patient = await Patient.findById(decoded.id).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    req.user = patient; // attach patient info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  authenticateDoctor,
  authenticatePatient,
};
