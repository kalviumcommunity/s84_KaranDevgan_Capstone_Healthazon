import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";

connectDB();

const app = express();
app.get("/", (req, res) => {
  res.json({
    message: "Healthazon API is running successfully",
    version: "1.0.0",
    status: "healthy",
  });
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
