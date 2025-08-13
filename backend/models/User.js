import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor"], default: "patient" },
    //DOCTOR-SPECIFIC-FIELDS
    specialization: { type: String },
    experience: { type: Number },
    bio: { type: String },
    isApproved: { type: Boolean, default: false },
    contact: String,
    address: String,
    availableTimings: String,
    // PATIENT-SPECIFIC FIELDS
    gender: { type: String },
    age: { type: Number },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
