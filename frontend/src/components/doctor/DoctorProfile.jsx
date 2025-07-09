// src/components/doctor/DoctorProfile.jsx
import React from "react";
import "./DoctorProfile.css"; 
export default function DoctorProfile({
  doctor,
  form,
  setForm,
  isEditing,
  setIsEditing,
  saveProfile,
  handleLogout,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    const values = value.split(",").map((v) => v.trim());
    setForm((f) => ({ ...f, [name]: values }));
  };

  if (!doctor) return <p>Loading profile...</p>;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img
          src={
            doctor.profileImage ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-${doctor._id}`
          }
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
  );
}
