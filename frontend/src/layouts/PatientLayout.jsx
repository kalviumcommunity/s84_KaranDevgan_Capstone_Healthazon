import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/PatientLayout.css";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PatientLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleLogout = () => {
    logout();
    alert("Logged out successfully... ");
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  return (
    <div className="patient-layout">
      <ToastContainer position="top-right" autoClose={2000} />

      <button
        className="hamburger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="patient-sidebar"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2>Patient Panel</h2>
            <nav>
              <NavLink to="/patient/dashboard">Dashboard</NavLink>
              <NavLink to="/patient/book">Book Appointment</NavLink>
              <NavLink to="/patient/appointments">My Appointments</NavLink>
              <NavLink to="/patient/reports">Reports</NavLink>
              <NavLink to="/patient/profile">Profile</NavLink>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="patient-content">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;

