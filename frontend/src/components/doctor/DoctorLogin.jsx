// pages/DoctorLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./DoctorForm.css";

function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Utility: clear any existing patient session
  const clearPatientSession = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patient");
  };
  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/doctor/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        clearPatientSession();
        localStorage.setItem("token", data.token);
        localStorage.setItem("doctor", JSON.stringify(data.doctor));
        navigate("/doctor-dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in");
      console.error(err);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenId: credentialResponse.credential }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("doctor", JSON.stringify(data.doctor));
        navigate("/doctor-dashboard");
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (err) {
      alert("Error during Google login");
      console.error(err);
    }
  };

  return (
    <div className="doctor-form-container">
      <div className="doctor-form-card">
        <h2>Doctor Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <p>or</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
