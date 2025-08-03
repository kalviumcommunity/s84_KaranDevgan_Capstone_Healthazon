import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-password");
  res.json(doctors);
});
