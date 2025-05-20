const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser; // Password required for non-Google users
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
    profileImage: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Only some doctors will have it
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
