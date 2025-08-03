const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Mongodb connected successfully");
  } catch (err) {
    console.error("Error in mongoDB connection: ", err);
  }
};

module.exports = connectDB;
