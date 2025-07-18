// doctorGoogleAuthController
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const doctorGoogleLogin = async (req, res) => {
  console.log(GOOGLE_CLIENT_ID);
  try {
    const { tokenId } = req.body;
     
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let doctor = await Doctor.findOne({ email });

    if (!doctor) {
      doctor = new Doctor({
        name,
        email,
        googleId,
        isGoogleUser: true,
        profileImage: picture,
        password: null, // Not required due to schema condition
      });
      await doctor.save();
    }

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const doctorData = doctor.toObject();
    delete doctorData.password;

    res.status(200).json({
      message: "Google login successful",
      token,
      doctor: doctorData,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ message: "Google login failed" });
  }
};

module.exports = { doctorGoogleLogin };
