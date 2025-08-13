import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserMd, FaHeartbeat } from "react-icons/fa";
import API from "../../services/api";
import ForgotPassword from "./ForgotPassword";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      login({
        user: {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        },
        token: res.data.token,
      });

      showToast.success("Login successful! Welcome back.");

      // Redirect based on role
      if (res.data.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err) {
      showToast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>

      <div className="auth-content">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <div className="auth-logo">
              <FaHeartbeat />
              <span>Healthazon</span>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="form-actions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                type="submit"
                className="auth-button primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </motion.div>
          </form>

          <motion.div
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="auth-illustration"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="illustration-content">
            <div className="illustration-icon">
              <FaUserMd />
            </div>
            <h2>Your Health Journey Starts Here</h2>
            <p>
              Connect with expert doctors and manage your healthcare with ease
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
