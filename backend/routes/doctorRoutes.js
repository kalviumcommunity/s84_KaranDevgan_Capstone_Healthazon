// routes/doctorRoutes.js
const express = require("express");
const { getAllDoctors } = require("../controllers/doctorController");

const router = express.Router();
router.get("/", getAllDoctors);

module.exports = router;
