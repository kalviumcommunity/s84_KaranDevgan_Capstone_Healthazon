const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: Number,
    gender: String,
    medicalReports: [
      {
        url: String,
        uploadedAt: Date,
      },
    ],
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
