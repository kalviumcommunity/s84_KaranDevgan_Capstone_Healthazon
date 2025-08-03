import express from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getPatientReports,
} from "../controllers/patientController.js"; 

import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/new", protect, restrictTo("patient"), bookAppointment);
router.get(
  "/self",
  protect,
  restrictTo("patient"),
  getPatientAppointments
);
router.get("/reports", protect, restrictTo("patient"), getPatientReports);

export default router;
