import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
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

      const res = await API.put(
        "/doctor/profile",
        formData,
        config
      );

      toast.success("Profile completed successfully");
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to complete doctor profile"
      );
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Complete Doctor Profile</h2>

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          required
          value={formData.specialization}
          onChange={handleChange}
        />
        <input
          type="number"
          name="experience"
          placeholder="Experience (years)"
          required
          value={formData.experience}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          required
          value={formData.contact}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Clinic Address"
          required
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="availableTimings"
          placeholder="Available Timings"
          required
          value={formData.availableTimings}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Short Bio"
          rows="3"
          value={formData.bio}
          onChange={handleChange}
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default CompleteDoctorProfile;
