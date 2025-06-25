import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import doctorImage from "../assets/Doctor2.jpg";

function Home() {
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState("");

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero">
          <div className="hero-text">
            <h2>Your Health, Just a Click Away</h2>
            <p>
              Book appointments, consult with doctors online or offline, and
              manage your medical records—all from one place.
            </p>
            <div className="buttons">
              {/*
               */}
              <button
                className="primary"
                onClick={() => {
                  const token = localStorage.getItem("patientToken");
                  if (token) {
                    navigate("/patient/book");
                  } else {
                    setAlertMsg(
                      "Please login or signup to book an appointment."
                    );
                    setTimeout(() => setAlertMsg(""), 3000); // clears after 3 sec
                  }
                }}
              >
                Book Appointment
              </button>
              <button className="secondary" onClick={() => navigate("/about")}>
                Learn More
              </button>
            </div>
            {alertMsg && <p className="alert">{alertMsg}</p>}
          </div>
          <div className="hero-image">
            <img
              src={doctorImage}
              alt="Doctor"
              style={{ width: "400px", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="cards-section">
        <h3>Our Services</h3>
        <div className="cards-grid">
          <div className="card">
            <h4>General Consultation</h4>
            <p>
              Talk to certified general physicians for your health concerns.
            </p>
          </div>
          <div className="card">
            <h4>Specialist Booking</h4>
            <p>
              Book appointments with cardiologists, dermatologists, and more.
            </p>
          </div>
          <div className="card">
            <h4>Health Records</h4>
            <p>
              Access and manage prescriptions, reports, and lab results online.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
