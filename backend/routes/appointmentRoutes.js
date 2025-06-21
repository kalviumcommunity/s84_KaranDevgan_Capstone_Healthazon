const express = require("express");
const router = express.Router();
const {
  authenticateDoctor,
  authenticatePatient,
} = require("../middleware/authMiddleware");
const {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getDoctorNotifications,
  getPatientNotifications,
  getAppointmentsByStatus,
  markNotificationAsRead,
  acceptAppointment,
  rejectAppointment,
} = require("../controllers/appointmentController");

router.get("/appointments", getAllAppointments);
router.post("/appointment", createAppointment);
router.put("/appointment/:id", updateAppointment);
router.get("/appointment/patient/:patientId", getAppointmentsByPatient);
router.get("/appointment/doctor/:doctorId", getAppointmentsByDoctor);

router.get(
  "/patient/notifications",
  authenticatePatient,
  getPatientNotifications
);
router.get("/doctor/notifications", authenticateDoctor, getDoctorNotifications);
router.put(
  "/doctor/notification/:id",
  authenticateDoctor,
  markNotificationAsRead
);

router.put("/appointment/:id/accept", authenticateDoctor, acceptAppointment);
router.put("/appointment/:id/reject", authenticateDoctor, rejectAppointment);

router.get(
  "/appointments/status/:status/doctor",
  authenticateDoctor,
  (req, res, next) => {
    req.params.role = "doctor"; // inject role into params
    next();
  },
  getAppointmentsByStatus
);

router.get(
  "/appointments/status/:status/patient",
  authenticatePatient,
  (req, res, next) => {
    req.params.role = "patient"; // inject role into params
    next();
  },
  getAppointmentsByStatus
);

module.exports = router;
