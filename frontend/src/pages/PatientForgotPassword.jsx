import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const PatientForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      const res = await axios.post(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/send-otp",
        { email, userType: "patient" }
      );
      setOtpSent(true);
      setMessage("OTP sent to your email.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP.");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/reset-password",
        { email, otp, newPassword, userType: "patient" }
      );
      setMessage("Password reset successful. You can now log in.");
    } catch (error) {
      console.error("Reset failed:", error);
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password (Patient)</h2>
      {message && <p>{message}</p>}

      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default PatientForgotPassword;
