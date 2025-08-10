import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import doctors from "./doctors.js";

dotenv.config();

mongoose.connect(
  "mongodb+srv://Karan:XXXXX@cluster0.bcqbivm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const importDoctors = async () => {
  try {
    // Hash passwords before inserting
    const doctorsWithHashedPasswords = await Promise.all(
      doctors.map(async (doctor) => {
        const hashedPassword = await bcrypt.hash(doctor.password, 10);
        return {
          ...doctor,
          password: hashedPassword,
        };
      })
    );

    await User.deleteMany({ role: "doctor" });
    await User.insertMany(doctorsWithHashedPasswords);
    console.log("Doctors seeded with hashed passwords!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

importDoctors();
