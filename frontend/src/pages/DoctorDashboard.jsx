
// src/pages/DoctorDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentsList from "../components/doctor/DoctorAppointmentsList";
import NotificationBell from "../components/NotificationBell";
import "./DoctorDashboard.css";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    fees: "",
    profileImage: "",
    location: "",
    experience: "",
    availableDays: [],
    languagesSpoken: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

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
        name: data.name || "",
        specialization: data.specialization || "",
        fees: data.fees || "",
        profileImage: data.profileImage || "",
        location: data.location || "",
        experience: data.experience || "",
        availableDays: data.availableDays || [],
        languagesSpoken: data.languagesSpoken || [],
      });
    };
    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    const values = value.split(",").map((v) => v.trim());
    setForm((f) => ({ ...f, [name]: values }));
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/doctor-login");
  };

  if (!doctor) return <p>Loading profile...</p>;

  return (
    <main className="main">
          <NotificationBell />
      <h2>Welcome back,  Dr {doctor.name} 👋</h2>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-${doctor._id}`}
            alt="Avatar"
            className="profile-avatar"
          />
        </div>

        {/* Name */}
        <div className="profile-field">
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input name="name" value={form.name} onChange={handleChange} />
          ) : (
            doctor.name
          )}
        </div>

        {/* Specialization */}
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

        {/* Fees */}
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

        {/* Location */}
        <div className="profile-field">
          <strong>Location:</strong>{" "}
          {isEditing ? (
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          ) : (
            doctor.location || "Not specified"
          )}
        </div>

        {/* Experience */}
        <div className="profile-field">
          <strong>Experience (years):</strong>{" "}
          {isEditing ? (
            <input
              name="experience"
              type="number"
              min="0"
              value={form.experience}
              onChange={handleChange}
            />
          ) : (
            doctor.experience ?? "Not specified"
          )}
        </div>

        {/* Available Days */}
        <div className="profile-field">
          <strong>Available Days:</strong>{" "}
          {isEditing ? (
            <input
              name="availableDays"
              value={form.availableDays.join(", ")}
              onChange={handleMultiChange}
              placeholder="e.g. Monday, Wednesday"
            />
          ) : doctor.availableDays?.length ? (
            doctor.availableDays.join(", ")
          ) : (
            "Not specified"
          )}
        </div>

        {/* Languages Spoken */}
        <div className="profile-field">
          <strong>Languages Spoken:</strong>{" "}
          {isEditing ? (
            <input
              name="languagesSpoken"
              value={form.languagesSpoken.join(", ")}
              onChange={handleMultiChange}
              placeholder="e.g. English, Hindi"
            />
          ) : doctor.languagesSpoken?.length ? (
            doctor.languagesSpoken.join(", ")
          ) : (
            "Not specified"
          )}
        </div>

        {/* Profile Image */}
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

        {/* Buttons */}
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
      <DoctorAppointmentsList />
    </main>
  );
}
