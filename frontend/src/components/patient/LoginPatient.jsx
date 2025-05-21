import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./PatientAuth.css"; 

const LoginPatient = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Added navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/patient/login", {
        email,
        password,
      });

      // ✅ Store token and patient info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));

      console.log("Login Success:", res.data);
      navigate("/patient/dashboard"); // ✅ Redirect
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      alert("Login failed. Check your credentials.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const res = await axios.post(
        "http://localhost:3000/api/patient/google-login",
        {
          tokenId,
        }
      );

      // ✅ Store token and patient info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));

      console.log("Google Login Success:", res.data);
      navigate("/patient/dashboard"); // ✅ Redirect
    } catch (error) {
      console.error(
        "Google Login Error:",
        error.response?.data || error.message
      );
      alert("Google Sign-In failed.");
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
        <button type="submit">Login</button>
      </form>

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
