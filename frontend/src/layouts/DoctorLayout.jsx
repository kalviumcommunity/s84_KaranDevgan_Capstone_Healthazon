import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      background: '#f8fafc'
    }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Simple Sidebar */}
      <div style={{
        width: '250px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Simple Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#3b82f6'
        }}>
          <span>Doctor Portal</span>
        </div>

        {/* User Info */}
        <div style={{
          padding: '1rem',
          background: '#f1f5f9',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ fontWeight: '500', color: '#1e293b' }}>Welcome, Dr. {user?.name}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Doctor</div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink 
            to="/doctor/dashboard"
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#3b82f6' : '#64748b',
              background: isActive ? '#eff6ff' : 'transparent',
              borderRadius: '6px',
              fontWeight: isActive ? '600' : '500'
            })}
          >
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/doctor/appointments"
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#3b82f6' : '#64748b',
              background: isActive ? '#eff6ff' : 'transparent',
              borderRadius: '6px',
              fontWeight: isActive ? '600' : '500'
            })}
          >
            Appointments
          </NavLink>
          
          <NavLink 
            to="/doctor/availability"
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#3b82f6' : '#64748b',
              background: isActive ? '#eff6ff' : 'transparent',
              borderRadius: '6px',
              fontWeight: isActive ? '600' : '500'
            })}
          >
            Availability
          </NavLink>
          
          <NavLink 
            to="/doctor/profile"
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#3b82f6' : '#64748b',
              background: isActive ? '#eff6ff' : 'transparent',
              borderRadius: '6px',
              fontWeight: isActive ? '600' : '500'
            })}
          >
            Profile
          </NavLink>
        </nav>

        {/* Simple Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default DoctorLayout;
