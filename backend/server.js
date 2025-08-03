import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
//import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

import commonRoutes from "./routes/commonRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
//import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.get("/", (req, res) => {
  res.send("BackEnd API of Healthazon is running...");
});
app.use(cors());
app.use(express.json());
//app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/appointment" , appointmentRoutes);
// Error Handling
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
