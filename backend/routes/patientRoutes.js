const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.use("/", patientController);

module.exports = router;
