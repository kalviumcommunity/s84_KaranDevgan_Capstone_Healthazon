import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"
import doctors from "./doctors.js";

dotenv.config();
mongoose.connect("mongodb+srv://Karan:XXXXX@cluster0.bcqbivm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const importDoctors = async () => {
  try {
    await User.deleteMany({ role: "doctor" }); 
    await User.insertMany(doctors);
    console.log("Doctors seeded!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

importDoctors();
