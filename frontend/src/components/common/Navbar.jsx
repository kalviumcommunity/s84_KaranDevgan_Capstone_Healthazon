import { Link, useNavigate } from "react-router-dom";
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
      <h2 className="logo">   Healthazon</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
         <Link to  = "/doctors">Doctors</Link>
        {user ? (
          <>
            {user.role === "patient" && (
              <Link to="/patient/dashboard">My Dashboard</Link>
            )}
            {user.role === "doctor" && (
              <Link to="/doctor/dashboard">Doctor Panel</Link>
            )}
            <span>Hello, {user.name}</span>
            <button className="logout-btn" onClick={handleLogOut}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
