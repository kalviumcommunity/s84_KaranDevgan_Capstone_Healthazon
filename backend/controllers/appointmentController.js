// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";

// Book appointment (patient)
export const bookAppointment = async (req, res) => {
  try {
    console.log("Incoming body: " , req.body);
    const { doctor, date, time , issue , reports , prescription} = req.body;
    if (!doctor || !date || !time || !issue) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    console.log("Parsed fields:", {
      doctor,
      date,
      time,
      issue,
      reports,
      prescription,
    });

    const existing = await Appointment.findOne({
      doctor: doctor,
      date,
      time,
      
    });
    if (existing) {
      res.status(400);
      throw new Error("This time slot is already booked.");
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

// Get all patient appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialty")
      .sort({ date: -1 });
    res.status(200).json(appointments);
    console.log(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all doctor appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email age gender contact")
      .populate("doctor", "name specialization");
    res.status(200).json({appointments});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
