import asyncHandler from "express-async-handler";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";

export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time } = req.body;
  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date,
    time,
  });
  res.status(201).json(appointment);
});

export const getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    patient: req.user._id,
  }).populate("doctor", "name");
  res.json(appointments);
});

export const getPatientReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ patient: req.user._id });
  res.json(reports);
});

