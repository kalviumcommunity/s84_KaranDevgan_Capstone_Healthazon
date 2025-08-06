import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // ✅ import context
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login from context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await API.post(
        "/auth/login",
        formData
      );

      // ✅ Call AuthContext login with expected structure
      login({
        user: {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          // any other fields
        },
        token: res.data.token,
      });

      alert("Login successful");

      // Redirect based on role
      if (res.data.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message );
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
