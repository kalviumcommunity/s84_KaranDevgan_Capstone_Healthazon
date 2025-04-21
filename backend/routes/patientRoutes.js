// routes/patientRoutes.js
const express = require("express");
const { getAllPatients } = require("../controllers/patientController");

const router = express.Router();
router.get("/", getAllPatients);

module.exports = router;
