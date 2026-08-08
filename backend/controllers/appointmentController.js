import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, issue, reports, prescription, rescheduleFrom } = req.body;
    if (!doctor || !date || !time || !issue) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (rescheduleFrom) {
      await Appointment.findByIdAndDelete(rescheduleFrom);
    }

    const existing = await Appointment.findOne({
      doctor,
      date,
      time,
      _id: { $ne: rescheduleFrom },
    });
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor,
      date,
      time,
      issue,
      reports: reports || "",
      prescription: prescription || "",
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialization availableTimings experience bio address contact email")
      .sort({ date: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email age gender contact")
      .populate("doctor", "name specialization availableTimings")
      .sort({ date: -1 });
    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: status?.toLowerCase() || status },
      { new: true }
    );
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
