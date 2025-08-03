// backend/controllers/doctorController.js

import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// GET /api/doctors - All approved doctors (public or auth optional)
export const getAllApprovedDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-password");
  res.status(200).json(doctors);
});

// GET /api/doctor/me - Get own doctor profile (requires protect + restrictTo("doctor"))
export const getDoctorSelfInfo = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.user._id).select("-password");
  res.status(200).json(doctor);
});

// GET /api/doctors/:id - Single doctor by ID (public)
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await User.findOne({
    _id: req.params.id,
    role: "doctor",
  }).select("-password");

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  res.status(200).json(doctor);
});

// PUT /api/doctors/profile - Doctor updates profile (requires protect + restrictTo("doctor"))
export const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.user._id);

  doctor.name = req.body.name || doctor.name;
  doctor.email = req.body.email || doctor.email;
  doctor.specialization = req.body.specialization || doctor.specialization;
  doctor.experience = req.body.experience || doctor.experience;
  doctor.bio = req.body.bio || doctor.bio;
  doctor.isApproved = req.body.isApproved || doctor.isApproved;
  doctor.contact = req.body.contact || doctor.contact;
  doctor.address = req.body.address || doctor.address;
  doctor.availableTimings =
    req.body.availableTimings || doctor.availableTimings;
  const updated = await doctor.save();

  res.status(200).json({
    message: "Profile updated successfully",
    doctor: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      specialization: updated.specialization,
      experience: updated.experience,
      bio: updated.bio,
      isApproved: updated.isApproved,
    },
  });
});

// PUT /api/doctors/status - Update doctor approval status (probably admin only)
export const updateDoctorStatus = asyncHandler(async (req, res) => {
  const { doctorId, isApproved } = req.body;

  const doctor = await User.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctor.isApproved = isApproved;
  const updated = await doctor.save();

  res.status(200).json({
    message: `Doctor ${isApproved ? "approved" : "disapproved"} successfully`,
    doctor: updated,
  });
});
