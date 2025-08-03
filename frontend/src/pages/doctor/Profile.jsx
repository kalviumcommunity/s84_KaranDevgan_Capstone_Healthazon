import "../../styles/Profile.css";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../../services/api";

function DoctorProfile() {
  const { user, setUser, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    bio: "",
    contact: "",
    address: "",
    availableTimings: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("doctor/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(
        "/doctor/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Profile updated successfully!");
      setUser((prev) => ({ ...prev, ...res.data.doctor })); // update context
    } catch (err) {
      console.error("Error updating doctor profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input name="email" value={formData.email} readOnly />

        <label>Specialization:</label>
        <input
          name="specialization"
          value={formData.specialization || ""}
          onChange={handleChange}
        />

        <label>Experience (years):</label>
        <input
          type="number"
          name="experience"
          value={formData.experience || ""}
          onChange={handleChange}
        />

        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
        />

        <label>Contact:</label>
        <input
          name="contact"
          value={formData.contact || ""}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
        />

        <label>Available Timings:</label>
        <input
          name="availableTimings"
          value={formData.availableTimings || ""}
          onChange={handleChange}
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default DoctorProfile;
