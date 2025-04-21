// routes/appointmentRoutes.js
const express = require("express");
const { getAllAppointments } = require("../controllers/appointmentController");

const router = express.Router();
router.get("/", getAllAppointments);

module.exports = router;
