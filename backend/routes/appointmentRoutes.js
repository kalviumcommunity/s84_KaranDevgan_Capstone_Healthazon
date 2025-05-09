const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "-password -__v") // exclude sensitive info
      .populate("patient", "-password -__v");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
