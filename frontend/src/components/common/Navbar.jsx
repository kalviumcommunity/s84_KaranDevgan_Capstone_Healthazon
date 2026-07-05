import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link" aria-label="Healthazon home">
        <img src="/logo.svg" className="logo-badge" alt="Healthazon logo" />
        <h2 className="logo">Healthazon</h2>
      </Link>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/doctors">Doctors</NavLink>
        {user ? (
          <>
            {user.role === "patient" && <NavLink to="/patient/dashboard">My Dashboard</NavLink>}
            {user.role === "doctor" && <NavLink to="/doctor/dashboard">Doctor Panel</NavLink>}
            <span className="user-pill">Hello, {user.name}</span>
            <button type="button" className="logout-btn" onClick={handleLogOut}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="cta-link">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
