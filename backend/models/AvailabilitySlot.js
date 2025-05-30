const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AvailabilitySlot", availabilitySlotSchema);
