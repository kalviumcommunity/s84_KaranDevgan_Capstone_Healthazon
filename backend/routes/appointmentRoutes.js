
import express from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/new", protect, restrictTo("patient"), bookAppointment);
router.get("/patient", protect, restrictTo("patient"), getPatientAppointments);
router.get("/doctor", protect, restrictTo("doctor"), getDoctorAppointments);
router.put(
  "/:id/status",
  protect,
  restrictTo("doctor"),
  updateAppointmentStatus
);
router.delete("/:id", protect, cancelAppointment); // optional: restrict to same user or admin

export default router;
