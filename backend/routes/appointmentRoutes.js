const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  getAppointmentsByPatient,
} = require("../controllers/appointmentController");

router.get("/appointments", getAllAppointments);
router.post("/appointment", createAppointment);
router.put("/appointment/:id", updateAppointment);
router.get("/appointment/patient/:patientId", getAppointmentsByPatient);

module.exports = router;
