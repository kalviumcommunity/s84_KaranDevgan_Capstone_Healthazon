// src/pages/DoctorDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    fees: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 1) Load profile
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/doctor-login");

      const res = await fetch("http://localhost:3000/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem("token");
        return navigate("/doctor-login");
      }
      const { doctor: data } = await res.json();
      setDoctor(data);
      setForm({
        name: data.name,
        specialization: data.specialization,
        fees: data.fees,
        profileImage: data.profileImage || "",
      });
    };
    loadProfile();
  }, [navigate]);

  // 2) Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // 3) Save profile
  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/doctor/profile", {
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
    setDoctor(data.doctor);
    setIsEditing(false);
    alert("Profile updated");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/doctor-login");
  };

  if (!doctor) return <p>Loading profile...</p>;

  return (
    <main className="main">
      <h2>Welcome back, {doctor.name} 👋</h2>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-${doctor._id}`}
            alt="Avatar"
            className="profile-avatar"
          />
        </div>

        <div className="profile-field">
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input name="name" value={form.name} onChange={handleChange} />
          ) : (
            doctor.name
          )}
        </div>

        <div className="profile-field">
          <strong>Specialization:</strong>{" "}
          {isEditing ? (
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />
          ) : (
            doctor.specialization
          )}
        </div>

        <div className="profile-field">
          <strong>Fees (₹):</strong>{" "}
          {isEditing ? (
            <input
              name="fees"
              type="number"
              min="0"
              value={form.fees}
              onChange={handleChange}
            />
          ) : (
            doctor.fees
          )}
        </div>

        <div className="profile-field">
          <strong>Profile Image URL:</strong>{" "}
          {isEditing ? (
            <input
              name="profileImage"
              value={form.profileImage}
              onChange={handleChange}
            />
          ) : doctor.profileImage ? (
            <img
              src={doctor.profileImage}
              alt="Profile"
              className="small-avatar"
            />
          ) : (
            "None"
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
      </div>
    </main>
  );
}
