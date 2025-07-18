const sendAppointmentNotification = require("./mailController");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "-password -__v")
      .populate("patient", "-password -__v");

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createAppointment(req, res) {
  try {
    const {
      doctor,
      patient,
      appointmentDate, // Expect date in ISO string or Date object
      timeSlot,
      appointmentType,
      notes,
    } = req.body;

    if (
      !doctor ||
      !patient ||
      !appointmentDate ||
      !timeSlot ||
      !appointmentType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Format appointmentDate as 'YYYY-MM-DD' string to match AvailabilitySlot.date
    const appointmentDateStr = new Date(appointmentDate)
      .toISOString()
      .split("T")[0];

    // Create appointment
    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentDate,
      timeSlot,
      appointmentType,
      healthIssue: notes,
      status: "pending",
    });

    await newAppointment.save();
    const selectedDoctor = await Doctor.findById(newAppointment.doctor);
    const selectedPatient = await Patient.findById(newAppointment.patient);

    await sendAppointmentNotification({
      doctor: selectedDoctor,
      patient: selectedPatient,
      appointment: newAppointment,
    });
    return res
      .status(201)
      .json({ message: "Appointment created", appointment: newAppointment });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function updateAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    const updatedData = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updatedData,
      {
        new: true,
        runValidators: false,
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Optional: You may want to update the AvailabilitySlot appointment link if status changed to cancelled or completed
    // For example, if appointment cancelled, clear slot.appointment
    if (updatedData.status === "cancelled") {
      await AvailabilitySlot.updateOne(
        { appointment: updatedAppointment._id },
        { $set: { appointment: null } }
      );
    }

    return res.status(200).json({
      message: "Appointment updated",
      appointment: updatedAppointment,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ message: "Invalid patient ID" });
  }

  try {
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name specialization fees contact") // only relevant fields
      .sort({ appointmentDate: 1, timeSlot: 1 }); // optional: sort upcoming first

    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
};

async function getAppointmentsByDoctor(req, res) {
  const { doctorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: "Invalid doctor ID" });
  }

  try {
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "name age gender contact") // only relevant fields
      .sort({ appointmentDate: 1, timeSlot: 1 }); // sort by date/time

    res.json(appointments);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
}

const getDoctorNotifications = async (req, res) => {
  const doctorId = req.user._id; // Assuming you have doctor auth middleware!

  try {
    const notifications = await Appointment.find({ doctor: doctorId })
      .populate("patient", "name age gender contact")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching doctor notifications:", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

const markNotificationAsRead = async (req, res) => {
  const doctorId = req.user._id; // Assuming doctor is authenticated
  const appointmentId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({ message: "Invalid appointment ID" });
  }

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.doctorNotificationRead = true;
    await appointment.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error marking notification" });
  }
};

const acceptAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const doctorId = req.user._id; // assuming doctor is authenticated

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({ message: "Invalid appointment ID" });
  }

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "confirmed";
    appointment.doctorNotificationRead = true; // also mark as read!
    await appointment.save();

    res.status(200).json({ message: "Appointment accepted", appointment });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ message: "Server error accepting appointment" });
  }
};

const rejectAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const doctorId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({ message: "Invalid appointment ID" });
  }

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    appointment.doctorNotificationRead = true; // also mark as read!
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ message: "Server error rejecting appointment" });
  }
};

const getPatientNotifications = async (req, res) => {
  const patientId = req.user._id;

  try {
    const notifications = await Appointment.find({
      patient: patientId,
      patientNotificationRead: false,
    })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching patient notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAppointmentsByStatus = async (req, res) => {
  const userId = req.user._id;
  const { status, role } = req.params;

  const filter = { status };

  if (role === "doctor") {
    filter.doctor = userId;
  } else if (role === "patient") {
    filter.patient = userId;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const appointments = await Appointment.find(filter)
      .populate("doctor", "name specialization contact")
      .populate("patient", "name age gender contact")
      .sort({ appointmentDate: 1, timeSlot: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getDoctorNotifications,
  getPatientNotifications,
  getAppointmentsByStatus,
  markNotificationAsRead,
  acceptAppointment,
  rejectAppointment,
};
