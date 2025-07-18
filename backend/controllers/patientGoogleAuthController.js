const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const patientGoogleLogin = async (req, res) => {
  //console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let patient = await Patient.findOne({ googleId });

    if (!patient) {
      patient = new Patient({
        name,
        email,
        googleId,
        isGoogleUser: true,
        profileImage: picture,
        password: null,
        age: undefined,
        gender: "male",
      });
      await patient.save();
    }

    const jwtToken = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const patientData = patient.toObject();
    delete patientData.password;

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      patient: patientData,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ message: "Google login failed" });
  }
};

module.exports = { patientGoogleLogin };
