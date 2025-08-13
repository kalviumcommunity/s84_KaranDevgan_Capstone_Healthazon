import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        `/auth/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password reset successful. Please login with your new password.",
          },
        });
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="logo-section">
          <h1>Healthazon</h1>
          <h2>Reset Password</h2>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>

          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li className={password.length >= 6 ? "valid" : "invalid"}>
                At least 6 characters
              </li>
              <li
                className={/(?=.*[a-z])/.test(password) ? "valid" : "invalid"}
              >
                One lowercase letter
              </li>
              <li
                className={/(?=.*[A-Z])/.test(password) ? "valid" : "invalid"}
              >
                One uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(password) ? "valid" : "invalid"}>
                One number
              </li>
            </ul>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <span className="loading-spinner">Resetting...</span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {message && (
          <div className="success-message">
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
