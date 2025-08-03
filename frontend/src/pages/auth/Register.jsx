import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {useAuth} from "../../context/AuthContext";
//import { toast } from "react-toastify";
import "../../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // 'doctor' or 'patient'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        "/auth/register",
        formData
      );
      console.log(res);
      // ✅ Update AuthContext and localStorage
      login({
        user: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        },
        token: res.data.token,
      });
      // Redirect based on role
      if (res.data.role === "doctor") {
        navigate("/complete-doctor-profile");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
