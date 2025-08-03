import "../../styles/MyAppointments.css";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
       
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await API.get(
          "/appointment/patient",
          config
        );

        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter((a) => a.date >= today);
  const past = appointments.filter((a) => a.date < today);
  return (
    <div className="appointments-page">
      <h2>My Appointments</h2>

      <section>
        <h3>Upcoming Appointments</h3>
        {upcoming.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <div className="appointment-list">
            {upcoming.map((a) => (
              <div key={a._id} className="appointment-card upcoming">
                <h4>{a.doctor?.name}</h4>
                <p>{a.doctor?.specialty}</p>
                <p>
                  {a.date} at {a.time}
                </p>
                <span className={`status ${a.status.toLowerCase()}`}>
                  {a.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3>Past Appointments</h3>
        {past.length === 0 ? (
          <p>No past appointments.</p>
        ) : (
          <div className="appointment-list">
            {past.map((a) => (
              <div key={a._id} className="appointment-card past">
                <h4>{a.doctor?.name}</h4>
                <p>{a.doctor?.specialty}</p>
                <p>
                  {a.date} at {a.time}
                </p>
                <span className={`status ${a.status.toLowerCase()}`}>
                  {a.status || "Completed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyAppointments;
