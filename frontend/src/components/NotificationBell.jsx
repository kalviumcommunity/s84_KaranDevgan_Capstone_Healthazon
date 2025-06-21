import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/doctor/notifications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [token]);

  const markAsRead = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/doctor/notification/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state to mark as read
      setNotifications((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, doctorNotificationRead: true } : a
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(
    (a) => !a.doctorNotificationRead
  ).length;

  return (
    <div className="notification-bell">
      <button
        className="bell-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((appointment) => (
              <div
                key={appointment._id}
                className={`notification-item ${
                  appointment.doctorNotificationRead ? "read" : "unread"
                }`}
              >
                <p>
                  New request from <strong>{appointment.patient?.name}</strong>{" "}
                  for{" "}
                  <strong>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </strong>
                </p>
                {!appointment.doctorNotificationRead && (
                  <button
                    className="mark-read-btn"
                    onClick={() => markAsRead(appointment._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
