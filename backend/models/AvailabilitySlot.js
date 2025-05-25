const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment")
const availabilitySlotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
    time: { type: String, required: true }, // Format: '10:00 AM - 11:00 AM'
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    mode: { type: String, enum: ["online", "offline"], default: "offline" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AvailabilitySlot", availabilitySlotSchema);
