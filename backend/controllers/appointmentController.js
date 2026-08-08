import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, issue, reports, prescription, rescheduleFrom } = req.body;
    if (!doctor || !date || !time || !issue) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (rescheduleFrom) {
      await Appointment.findByIdAndDelete(rescheduleFrom);
    }

    const existing = await Appointment.findOne({
      doctor,
      date,
      time,
      _id: { $ne: rescheduleFrom },
    });
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor,
      date,
      time,
      issue,
      reports: reports || "",
      prescription: prescription || "",
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialization availableTimings experience bio address contact email")
      .sort({ date: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email age gender contact")
      .populate("doctor", "name specialization availableTimings")
      .sort({ date: -1 });
    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, prescription, investigations, diagnosis, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const targetStatus = status?.toLowerCase() || appointment.status;

    console.log("================ APPOINTMENT TIMECHECK DEBUG ================");
    console.log("Appointment ID:", appointment._id);
    console.log("Raw Appointment Date:", appointment.date);
    console.log("Raw Appointment Time:", appointment.time);
    console.log("Target Status:", targetStatus);

    // Validate that appointment time has arrived/passed before marking as completed
    if (targetStatus === "completed") {
      const now = new Date();
      const cleanDate = String(appointment.date || "").split("T")[0].trim();
      let apptHours = 0;
      let apptMinutes = 0;

      if (appointment.time && typeof appointment.time === "string") {
        const cleanTime = appointment.time.trim().toLowerCase();
        const isPM = cleanTime.includes("pm");
        const isAM = cleanTime.includes("am");
        const match = cleanTime.match(/(\d{1,2}):(\d{2})/);

        if (match) {
          apptHours = parseInt(match[1], 10);
          apptMinutes = parseInt(match[2], 10);

          if (isPM && apptHours < 12) apptHours += 12;
          if (isAM && apptHours === 12) apptHours = 0;
        }
      }

      const padH = String(apptHours).padStart(2, "0");
      const padM = String(apptMinutes).padStart(2, "0");

      // Construct timezone-aware local datetime (+05:30 IST)
      const isoWithOffset = `${cleanDate}T${padH}:${padM}:00+05:30`;
      const apptDateObj = new Date(isoWithOffset);

      let apptTimePassed = false;
      if (!isNaN(apptDateObj.getTime())) {
        apptTimePassed = now.getTime() >= apptDateObj.getTime();
      } else {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const localTodayStr = `${year}-${month}-${day}`;
        apptTimePassed = cleanDate <= localTodayStr;
      }

      console.log("Clean Appt Date:", cleanDate);
      console.log("Parsed Appt Time:", `${padH}:${padM}`);
      console.log("Appt Time ISO (+05:30):", isoWithOffset);
      console.log("Appt Date UTC Epoch:", apptDateObj.toISOString());
      console.log("Current Server UTC Time:", now.toISOString());
      console.log("Comparison result (now >= apptDateObj):", apptTimePassed);
      console.log("=============================================================");

      if (!apptTimePassed) {
        return res.status(400).json({
          message: "You can only mark an appointment as completed after its scheduled date and time has passed.",
        });
      }

      appointment.status = "completed";
      appointment.prescription = prescription !== undefined ? prescription : appointment.prescription;
      appointment.investigations = investigations !== undefined ? investigations : appointment.investigations;
      appointment.diagnosis = diagnosis !== undefined ? diagnosis : appointment.diagnosis;
      appointment.notes = notes !== undefined ? notes : appointment.notes;
      appointment.completedAt = new Date();
    } else {
      appointment.status = targetStatus;
    }

    const updated = await appointment.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
