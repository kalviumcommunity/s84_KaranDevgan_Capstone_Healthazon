const express = require("express");
const router = express.Router();
const {
  createSlot,
  getSlotsByDoctor,
  deleteSlot,
} = require("../controllers/availabilityController");

// Create a new slot
router.post("/availability", createSlot);

// Get available slots using query: ?doctorId=...&date=YYYY-MM-DD
router.get("/availability", getSlotsByDoctor);

// Delete a specific slot
router.delete("/availability/:slotId", deleteSlot);

module.exports = router;
