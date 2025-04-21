// controllers/patientController.js
const getAllPatients = (req, res) => {
  res.json([
    { id: 1, name: "Ram Mohan", age: 45 },
    { id: 2, name: "Avinash Kumar", age: 40 },
  ]);
};

module.exports = { getAllPatients };
