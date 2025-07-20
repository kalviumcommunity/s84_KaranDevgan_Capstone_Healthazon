import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // optional, if you want separate navbar styles

function Navbar() {
  const navigate = useNavigate();
  const doctor = localStorage.getItem("doctorToken")
    ? JSON.parse(localStorage.getItem("doctor"))
    : null;
  const patient = localStorage.getItem("patientToken")
    ? JSON.parse(localStorage.getItem("patient"))
    : null;

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("patient");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo">Healthazon</h1>
      <nav>
        <Link to="/">Home</Link>

        {doctor ? (
          <div className="dropdown">
            <span className="dropdown-title">Dr. {doctor.name} ▾</span>
            <div className="dropdown-content">
              <Link to="/doctor-dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="dropdown">
            <span className="dropdown-title">Doctors ▾</span>
            <div className="dropdown-content">
              <Link to="/doctors">List of Doctors</Link>
              <Link to="/doctor-login">Login</Link>
              <Link to="/doctor-register">Register</Link>
            </div>
          </div>
        )}

        {patient ? (
          <div className="dropdown">
            <span className="dropdown-title">{patient.name} ▾</span>
            <div className="dropdown-content">
              <Link to="/patient/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="dropdown">
            <span className="dropdown-title">Patients ▾</span>
            <div className="dropdown-content">
              <Link to="/patient/login">Login</Link>
              <Link to="/patient/register">Register</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
