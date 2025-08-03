import { Outlet, NavLink } from "react-router-dom";
import "../styles/DoctorLayout.css";

function DoctorLayout() {
  return (
    <div className="doctor-layout">
      <aside className="sidebar">
        <h2>Doctor Panel</h2>
        <nav>
          <NavLink to="/doctor/dashboard">Dashboard</NavLink>
          <NavLink to="/doctor/appointments">Appointments</NavLink>
          <NavLink to="/doctor/availability">Availability</NavLink>
          <NavLink to="/doctor/profile">Profile</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DoctorLayout;
