const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");


router.use("/", doctorController);

module.exports = router;
