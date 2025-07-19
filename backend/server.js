require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://healthazon.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);
app.use("/api", appointmentRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Healthazon" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB();

