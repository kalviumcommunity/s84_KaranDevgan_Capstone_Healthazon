const mongoose = require("mongoose");
const AvailabilitySlot = require("../models/AvailabilitySlot");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ✅ Create Slot
async function createSlot(req, res) {
  try {
    const { doctor, date, time, mode } = req.body;

    if (!doctor || !date || !time) {
      return res
        .status(400)
        .json({ message: "Doctor, date, and time are required" });
    }

    if (!isValidObjectId(doctor)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const dateObj = new Date(date); // Convert date string to Date object

    const existingSlot = await AvailabilitySlot.findOne({
      doctor,
      date: dateObj,
      time,
    });
    if (existingSlot) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    const slot = new AvailabilitySlot({ doctor, date: dateObj, time, mode });
    await slot.save();

    return res
      .status(201)
      .json({ message: "Slot created", slot, available: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// ✅ Get Slots for a Doctor (optionally filter by date)
async function getSlotsByDoctor(req, res) {
  try {
    const doctorId = req.query.doctorId || req.params.doctorId;
    const date = req.query.date;

    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const filter = { doctor: doctorId, appointment: null };
    if (date) {
      filter.date = new Date(date); // Query with proper date object
    }

    const slots = await AvailabilitySlot.find(filter).sort({
      date: 1,
      time: 1,
    });

    return res.status(200).json(slots);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// ✅ Delete Slot
async function deleteSlot(req, res) {
  try {
    const { slotId } = req.params;

    if (!isValidObjectId(slotId)) {
      return res.status(400).json({ message: "Invalid slot ID" });
    }

    const deleted = await AvailabilitySlot.findByIdAndDelete(slotId);
    if (!deleted) {
      return res.status(404).json({ message: "Slot not found" });
    }

    return res.status(200).json({ message: "Slot deleted", slot: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createSlot,
  getSlotsByDoctor,
  deleteSlot,
};
