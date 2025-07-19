import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./PatientAuth.css";

const LoginPatient = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Utility: clear any existing doctor session
  const clearDoctorSession = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("doctorToken");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/patient/login",
        {
          email,
          password,
        }
      );
      clearDoctorSession(); // ✅ clear doctor session
      localStorage.setItem("patientToken", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));

      //console.log("Login Success:", res.data);
      navigate("/patient/dashboard");
    } catch (err) {
      //console.error("Login Failed:", err.response?.data || err.message);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    clearDoctorSession();
    setLoading(true);

    try {
      const tokenId = credentialResponse.credential;
      //console.log(tokenId);
      const res = await axios.post(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/patient/google-login",
        { tokenId }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));

      //console.log("Google Login Success:", res.data);

      // Optionally: Redirect Google user to complete their profile
      if (!res.data.patient.age || !res.data.patient.contact) {
        navigate("/patient/complete-profile");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      console.error(
        "Google Login Error:",
        error.response?.data || error.message
      );
      alert("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Patient Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        <span
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/patient/forgot-password")}
        >
          Forgot Password?
        </span>
      </p>
      <div className="google-login">
        <p>Or</p>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google Sign-In Failed")}
        />
      </div>
    </div>
  );
};

export default LoginPatient;
