import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaBookMedical, FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/PortalLayout.css";

function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navItems = [
    { to: "/patient/dashboard", label: "Dashboard", icon: <FaUserCircle /> },
    { to: "/patient/book", label: "Book Appointment", icon: <FaCalendarAlt /> },
    { to: "/patient/appointments", label: "My Appointments", icon: <FaClipboardList /> },
    { to: "/patient/reports", label: "Reports", icon: <FaBookMedical /> },
    { to: "/patient/profile", label: "Profile", icon: <FaUserCircle /> },
  ];

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <div className="portal-brand-mark">H</div>
          <div>
            <strong>Healthazon</strong>
            <span>Patient Portal</span>
          </div>
        </div>

        <div className="portal-user-card">
          <p>Welcome back</p>
          <h3>{user?.name || "Patient"}</h3>
          <span>Personal care dashboard</span>
        </div>

        <nav className="portal-nav" aria-label="Patient navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `portal-nav-link${isActive ? " active" : ""}`}
            >
              <span className="portal-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="portal-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <main className="portal-main">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;

