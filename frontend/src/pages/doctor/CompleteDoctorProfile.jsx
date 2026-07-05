import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FaBriefcaseMedical, FaMapMarkerAlt, FaRegClock, FaStethoscope, FaUserMd } from "react-icons/fa";
import "../../styles/DoctorProfile.css";
function CompleteDoctorProfile() {
  const navigate = useNavigate();
  const {token} = useAuth();
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    contact: "",
    address: "",
    availableTimings: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await API.put(
        "/doctor/profile",
        formData,
        config
      );

      showToast.success("Profile completed successfully");
      navigate("/doctor/dashboard");
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Failed to complete profile"
      );
    }
  };

  return (
    <div className="doctor-profile-page">
      <motion.section
        className="doctor-profile-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <span className="doctor-profile-kicker">Doctor onboarding</span>
          <h1>Complete your professional profile</h1>
          <p>Add your clinical details so patients can trust your listing and book with confidence.</p>
        </div>
        <div className="doctor-profile-hero-chip">
          <FaUserMd />
          <span>Verified presence on Healthazon</span>
        </div>
      </motion.section>

      <motion.form
        className="doctor-profile-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <div className="doctor-profile-section-title">
          <FaBriefcaseMedical />
          <h2>Professional details</h2>
        </div>

        <div className="doctor-profile-grid">
          <label className="doctor-field">
            <span><FaStethoscope /> Specialization</span>
            <input
              type="text"
              name="specialization"
              placeholder="Cardiology, Dermatology, General Medicine"
              required
              value={formData.specialization}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field">
            <span><FaRegClock /> Experience (years)</span>
            <input
              type="number"
              name="experience"
              placeholder="5"
              required
              value={formData.experience}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field">
            <span>Contact number</span>
            <input
              type="text"
              name="contact"
              placeholder="+1 555 000 0000"
              required
              value={formData.contact}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field doctor-field-full">
            <span><FaMapMarkerAlt /> Clinic address</span>
            <input
              type="text"
              name="address"
              placeholder="Clinic address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field">
            <span>Available timings</span>
            <input
              type="text"
              name="availableTimings"
              placeholder="Mon-Fri, 9:00 AM - 5:00 PM"
              required
              value={formData.availableTimings}
              onChange={handleChange}
            />
          </label>

          <label className="doctor-field doctor-field-full">
            <span>Bio</span>
            <textarea
              name="bio"
              placeholder="Short professional summary and patient care focus"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" className="doctor-profile-save">Save profile</button>
      </motion.form>
    </div>
  );
}

export default CompleteDoctorProfile;
