// src/pages/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", contact: "" });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 1) Load profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/patient/login");

      const res = await fetch("http://localhost:3000/api/patient/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // invalid token or not found
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

  // 2) Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // 3) Save updated profile
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

  // 4) Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/patient/login");
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
          <p>[Placeholder] Upcoming appointments will be shown here.</p>
        </div>

        <div className="dashboard-section">
          <h3>Health Records</h3>
          <p>[Placeholder] Your health records will appear here.</p>
        </div>
      </div>
    </main>
  );
}
