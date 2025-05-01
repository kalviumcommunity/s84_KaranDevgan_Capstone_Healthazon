const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
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
    specialization: String,
    experience: Number,
    availability: [
      {
        day: String,
        from: String,
        to: String,
      },
    ],
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
