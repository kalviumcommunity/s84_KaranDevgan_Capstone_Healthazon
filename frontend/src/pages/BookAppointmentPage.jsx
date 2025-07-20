
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookAppointmentForm from "../components/BookAppointmentForm";
import "./BookAppointmentPage.css"; // Add this import

const BookAppointmentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("patientToken");
    if (!token) {
      navigate("/patient/login");
    }
  }, [navigate]);

  return (
    <div className="book-appointment-page">
      {" "}
      {/* Updated class name */}
      <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
      <BookAppointmentForm />
    </div>
  );
};

export default BookAppointmentPage;