import "../../styles/Profile.css";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../../services/api";
import { showToast } from "../../utils/toast";
import "../../styles/DoctorProfile.css";
function DoctorProfile() {
  const { setUser, token } = useAuth();

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
      } catch {
        showToast.error("Error fetching doctor profile");
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

      showToast.success(res.data.message || "Profile updated successfully!");
      setUser((prev) => ({ ...prev, ...res.data.doctor })); // update context
    } catch {
      showToast.error("Error updating doctor profile");
    }
  };

  return (
    <div className="doctor-profile-page">
      <div className="doctor-profile-hero compact">
        <div>
          <span className="doctor-profile-kicker">Profile management</span>
          <h1>My doctor profile</h1>
          <p>Keep your professional information accurate so patients can reach you easily.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="doctor-profile-card">
        <div className="doctor-profile-grid">
          <label className="doctor-field">
            <span>Name</span>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label className="doctor-field">
            <span>Email</span>
            <input name="email" value={formData.email} readOnly />
          </label>

          <label className="doctor-field">
            <span>Specialization</span>
            <input
              name="specialization"
              value={formData.specialization || ""}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field">
            <span>Experience (years)</span>
            <input
              type="number"
              name="experience"
              value={formData.experience || ""}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field doctor-field-full">
            <span>Bio</span>
            <textarea name="bio" value={formData.bio || ""} onChange={handleChange} />
          </label>

          <label className="doctor-field">
            <span>Contact</span>
            <input name="contact" value={formData.contact || ""} onChange={handleChange} />
          </label>

          <label className="doctor-field">
            <span>Address</span>
            <input name="address" value={formData.address || ""} onChange={handleChange} />
          </label>

          <label className="doctor-field doctor-field-full">
            <span>Available timings</span>
            <input
              name="availableTimings"
              value={formData.availableTimings || ""}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" className="doctor-profile-save">Update profile</button>
      </form>
    </div>
  );
}

export default DoctorProfile;
