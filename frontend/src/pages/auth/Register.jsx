import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaUserMd, 
  FaHeartbeat,
  FaUserTie
} from "react-icons/fa";
import API from "../../services/api";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await API.post("/auth/register", formData);
      
      login({
        user: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        },
        token: res.data.token,
      });

      showToast.success("Account created successfully!");
      
      // Redirect based on role
      if (res.data.role === "doctor") {
        navigate("/complete-doctor-profile");
      } else {
        navigate("/login");
      }
    } catch (error) {
      showToast.error(error.response?.data?.message || "Registration failed. Please try again. with valid data");
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
            <h1>Create Account</h1>
            <p>Join our healthcare community today</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
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
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="input-wrapper">
                <FaUserTie className="input-icon" />
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="auth-input"
                >
                  <option value="">Select your role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              className="form-actions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button 
                type="submit" 
                className="auth-button primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
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
            <h2>Join Our Healthcare Community</h2>
            <p>Connect with expert doctors or start your medical practice with us</p>
            <div className="role-benefits">
              <div className="benefit-item">
                <FaUserTie />
                <span>For Patients</span>
                <p>Easy appointment booking and secure health records</p>
              </div>
              <div className="benefit-item">
                <FaUserMd />
                <span>For Doctors</span>
                <p>Manage your practice and reach more patients</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
