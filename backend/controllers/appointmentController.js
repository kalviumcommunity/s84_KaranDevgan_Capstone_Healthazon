const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AvailabilitySlot = require("../models/AvailabilitySlot");

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

    // Check for availability slot with no appointment booked
    const slot = await AvailabilitySlot.findOne({
      doctor,
      date: appointmentDateStr,
      time: timeSlot,
      appointment: null,
    });

    if (!slot) {
      return res.status(400).json({
        message: "Doctor not available at the selected date/time slot",
      });
    }

    // Create appointment
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

    // Mark slot as booked by linking appointment
    slot.appointment = newAppointment._id;
    await slot.save();

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
        runValidators: true,
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

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  getAppointmentsByPatient,
};
