import express from "express";
import { getAllDoctors } from "../controllers/commonController.js";

const router = express.Router();
router.get("/doctors", getAllDoctors);

export default router;
