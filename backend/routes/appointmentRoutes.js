const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "-password -__v") // exclude sensitive info
      .populate("patient", "-password -__v");

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/appointment", async (req, res) => {
  try {
    const {
      doctor,
      patient,
      appointmentDate,
      timeSlot,
      appointmentType,
      notes,
    } = req.body;
    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentDate,
      timeSlot,
      appointmentType,
      notes,
      status: "pending",
    });

    await newAppointment.save();

    return res
      .status(201)
      .json({ message: "Appointment created", appointment: newAppointment });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ message: error.message });

  }
});

router.put("/appointment/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedData = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment updated",
      appointment: updatedAppointment,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
