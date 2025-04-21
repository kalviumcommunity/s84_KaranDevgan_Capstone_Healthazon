// controllers/appointmentController.js
const getAllAppointments = (req, res) => {
  res.json([
    {
      id: 1,
      patient: "Ram Mohan",
      doctor: "Dr. Rohan",
      date: "2025-04-22",
    },
    {
      id: 2,
      patient: "Avinash Kumar",
      doctor: "Dr. Deepankar",
      date: "2025-04-23",
    },
  ]);
};

module.exports = { getAllAppointments };
