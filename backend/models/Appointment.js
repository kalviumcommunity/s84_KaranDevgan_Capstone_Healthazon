import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled" , "confirmed"],
      default: "pending",
    },
    issue : {type : String , required : true},
    reports : {type : String}
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
