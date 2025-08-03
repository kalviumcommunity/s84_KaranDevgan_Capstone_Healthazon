import "../../styles/Profile.css";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../../services/api";
function Profile() {
  const { user, setUser, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
  });

  // Fetch current user from backend when page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(
        "/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      setUser(res.data); // Update AuthContext user
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ user: res.data, token })
      ); // Keep storage in sync
    } catch (err) {
      console.error("Update profile error:", err);
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

        <label>Age:</label>
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">-- Select Gender --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

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

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
