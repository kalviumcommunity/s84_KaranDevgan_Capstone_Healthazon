
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
router.put("/:id/cancel", protect, cancelAppointment);
router.delete("/:id", protect, cancelAppointment);

export default router;
