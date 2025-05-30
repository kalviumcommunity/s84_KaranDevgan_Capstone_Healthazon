

// src/pages/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import DoctorDetailsModal from "../components/doctor/DoctorDetails";
import AppointmentList from "../components/patient/AppointmentList";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", contact: "" });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Doctor filter & list states
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState("");

  // Modal logic
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load patient profile
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/patient/login");

      const res = await fetch("http://localhost:3000/api/patient/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem("token");
        navigate("/patient/login");
        return;
      }
      const { patient: data } = await res.json();
      setPatient(data);
      setForm({
        name: data.name || "",
        age: data.age || "",
        contact: data.contact || "",
      });
    };

    loadProfile();
  }, [navigate]);

  // Load doctors on filter change
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setErrorDoctors("");
      try {
        let query = [];
        if (specialization) query.push(`specialization=${encodeURIComponent(specialization)}`);
        if (maxFees) query.push(`fees=${encodeURIComponent(maxFees)}`);
        const queryString = query.length ? `?${query.join("&")}` : "";

        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/doctors${queryString}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch doctors");

        const data = await res.json();
        setDoctors(data);
      } catch (e) {
        setErrorDoctors(e.message);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [specialization, maxFees]);

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Save profile
  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/patient/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    setPatient(data.patient);
    setIsEditing(false);
    alert("Profile updated");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/patient/login");
  };

  // Modal handlers
  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
    setShowDetails(false);
  };

  const handleBookAppointment = (doctor) => {
    navigate("/patient/book", { state: { doctor } });
  };
  

  if (!patient) return <p>Loading profile...</p>;

  return (
    <main className="main">
      <h2>Welcome back, {patient.name} 👋</h2>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=patient-${patient._id}`}
            alt="Avatar"
            className="profile-avatar"
          />
        </div>

        <div className="profile-field">
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input name="name" value={form.name} onChange={handleChange} />
          ) : (
            patient.name
          )}
        </div>

        <div className="profile-field">
          <strong>Age:</strong>{" "}
          {isEditing ? (
            <input
              name="age"
              type="number"
              min="1"
              value={form.age}
              onChange={handleChange}
            />
          ) : (
            patient.age
          )}
        </div>

        <div className="profile-field">
          <strong>Contact:</strong>{" "}
          {isEditing ? (
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
            />
          ) : (
            patient.contact || "Not provided"
          )}
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <button className="edit-btn" onClick={saveProfile}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Your Appointments</h3>
          <AppointmentList />
        </div>

        <div className="dashboard-section">
          <h3>Health Records</h3>
          <p>[Placeholder] Your health records will appear here.</p>
        </div>
      </div>

      {/* --- Doctor filter and list section --- */}
      <section className="filter-section" style={{ marginTop: "2rem" }}>
        <h3>Filter Doctors</h3>

        <label>
          Specialization:
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
          </select>
        </label>

        <label style={{ marginLeft: "1rem" }}>
          Max Fees:
          <input
            type="number"
            min="0"
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
            placeholder="Enter max fees"
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </section>

      <section className="doctor-list-section" style={{ marginTop: "1rem" }}>
        <h3>Doctors</h3>

        {loadingDoctors && <p>Loading doctors...</p>}
        {errorDoctors && <p style={{ color: "red" }}>{errorDoctors}</p>}
        {!loadingDoctors && doctors.length === 0 && <p>No doctors found.</p>}

        <div
          className="doctor-list"
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          {doctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onViewDetails={handleViewDetails}
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>
      </section>

      {/* Doctor Details Modal */}
      {showDetails && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={handleCloseDetails}
        />
      )}
    </main>
  );
}
