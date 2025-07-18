import React, { useState } from "react";
import "./AuthCommon.css";

export default function RegisterPatient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
    contact: "",
    address: "",
    profileImage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/patient/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Registered successfully!");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register Patient</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={3}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          min={1}
        />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          pattern="[6-9]\d{9}"
          title="Enter a valid 10-digit Indian mobile number"
          value={formData.contact}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="profileImage"
          placeholder="Profile Image URL (Optional)"
          value={formData.profileImage}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
