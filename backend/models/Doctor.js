
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    specialization: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    fees: {
      type: Number,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    location: { type: String }, // NEW
    experience: { type: Number }, // NEW, years of experience
    availableDays: [{ type: String }], // e.g. ["Monday", "Wednesday"]
    languagesSpoken: [{ type: String }], // e.g. ["English", "Hindi"]

    profileImage: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    isGoogleUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
