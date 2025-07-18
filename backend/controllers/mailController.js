const sendMail = require("../utils/mailer");

const sendAppointmentNotification = async ({
  doctor,
  patient,
  appointment,
}) => {
  const formattedDate = new Date(appointment.appointmentDate).toDateString();

  // Email to Doctor
  await sendMail({
    to: doctor.email,
    subject: "🩺 New Appointment Request",
    html: `
      <h3>Hello Dr. ${doctor.name},</h3>
      <p>You have a new appointment request from <strong>${patient.name}</strong>.</p>
      <p><strong>Date:</strong> ${formattedDate}<br/>
         <strong>Time:</strong> ${appointment.timeSlot}<br/>
         <strong>Type:</strong> ${appointment.appointmentType}</p>
      <p>Please log in to your dashboard to confirm or reject the appointment as per you schedule.</p>
    `,
  });

  // Email to Patient
  await sendMail({
    to: patient.email,
    subject: "✅ Appointment Request Submitted",
    html: `
      <h3>Hello ${patient.name},</h3>
      <p>Your appointment request with <strong>Dr. ${doctor.name}</strong> has been submitted.</p>
      <p><strong>Date:</strong> ${formattedDate}<br/>
         <strong>Time:</strong> ${appointment.timeSlot}<br/>
         <strong>Type:</strong> ${appointment.appointmentType}</p>
      <p>You will be notified once it is confirmed by the doctor.</p>
    `,
  });
};

module.exports = sendAppointmentNotification;
