const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      required: function () {
        return !this.isGoogleUser;
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    contact: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v); // Basic Indian mobile pattern
        },
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },
    address: { type: String }, // Optional - for context during appointments
    profileImage: { type: String }, // Can be a link or base64 in future
    isGoogleUser: { type: Boolean, default: false },
    googleId: { type: String },
    medicalNotes: [{ type: String }], // Optional, for future patient record keeping
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Patient", patientSchema);
