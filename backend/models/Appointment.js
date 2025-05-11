const mongoose = require("mongoose");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: [true, "Doctor is required"],
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Patient is required"],
  },
  appointmentDate: {
    type: Date,
    required: [true, "Appointment date is required"],
    validate: {
      validator: function (value) {
        return value >= new Date(); // Ensure date is in the future
      },
      message: "Appointment date must be in the future",
    },
  },
  timeSlot: {
    type: String,
    required: [true, "Time slot is required"],
  },
  appointmentType: {
    type: String,
    enum: ["online", "offline", "video call"],
    required: [true, "Appointment type is required"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
