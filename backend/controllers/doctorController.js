// controllers/doctorController.js
const getAllDoctors = (req, res) => {
  res.json([
    { id: 1, name: "Dr. Rohan", specialization: "Neurosurgeon" },
    { id: 2, name: "Dr. Deepankar", specialization: "General Physician" },
  ]);
};

module.exports = { getAllDoctors };
