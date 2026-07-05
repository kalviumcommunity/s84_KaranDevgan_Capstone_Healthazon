import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaSignOutAlt, FaUserMd } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/PortalLayout.css";

function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navItems = [
    { to: "/doctor/dashboard", label: "Dashboard", icon: <FaUserMd /> },
    { to: "/doctor/appointments", label: "Appointments", icon: <FaCalendarAlt /> },
    { to: "/doctor/availability", label: "Availability", icon: <FaClock /> },
    { to: "/doctor/profile", label: "Profile", icon: <FaUserMd /> },
  ];

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <div className="portal-brand-mark">H</div>
          <div>
            <strong>Healthazon</strong>
            <span>Doctor Portal</span>
          </div>
        </div>

        <div className="portal-user-card">
          <p>Welcome back</p>
          <h3>Dr. {user?.name || "Doctor"}</h3>
          <span>Clinical workspace</span>
        </div>

        <nav className="portal-nav" aria-label="Doctor navigation">
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

export default DoctorLayout;
