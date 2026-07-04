import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import cors from "cors";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";

connectDB();

const app = express();
app.get("/api/health", (req, res) => {
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

// Serve frontend build (single-server behaviour)
const possiblePaths = [
  path.resolve(process.cwd(), "frontend", "dist"),
  path.resolve(process.cwd(), "..", "frontend", "dist"),
];

let frontendBuildPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    frontendBuildPath = p;
    break;
  }
}

if (frontendBuildPath) {
  app.use(express.static(frontendBuildPath));

  // For any non-API route, send index.html (SPA fallback)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  console.warn("Frontend build not found — requests to non-/api routes will 404.");
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
