import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: String,
    timeSlots: [String], // Example: ['10:00 AM', '10:30 AM']
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);
