const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
  gender: { type: String },
  contact: { type: String },
  profileImage: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String },
});

module.exports = mongoose.model("Patient", patientSchema);
