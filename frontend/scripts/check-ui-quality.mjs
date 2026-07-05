import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (file) => readFile(resolve(root, file), 'utf8');

const checks = [
  {
    file: 'src/layouts/DoctorLayout.jsx',
    mustInclude: ['portal-shell', 'portal-nav-link', 'portal-logout'],
    mustNotInclude: ['style={{', 'ToastContainer'],
  },
  {
    file: 'src/layouts/PatientLayout.jsx',
    mustInclude: ['portal-shell', 'portal-nav-link', 'portal-logout'],
    mustNotInclude: ['style={{', 'ToastContainer'],
  },
  {
    file: 'src/components/common/Footer.jsx',
    mustInclude: ['<Link to="/about"', '<Link to="/contact"'],
    mustNotInclude: ['<a href="/about"', '<a href="/contact"'],
  },
  {
    file: 'src/components/common/Navbar.jsx',
    mustInclude: ['logo-badge', 'NavLink', 'cta-link'],
    mustNotInclude: ['<h2 className="logo">   Healthazon</h2>'],
  },
  {
    file: 'src/pages/patient/BookAppointment.jsx',
    mustInclude: ['useLocation', 'bookingState', 'rescheduleFromId', 'selectedDoctor'],
    mustNotInclude: ['showToast.success("Appointment booked successfully!"'],
  },
  {
    file: 'src/pages/patient/MyAppointments.jsx',
    mustInclude: ['rescheduleFromId', 'handleViewDetails', 'navigate(`/doctors/'],
    mustNotInclude: ['console.log('],
  },
  {
    file: 'src/pages/patient/PatientDashboard.jsx',
    mustInclude: ['notification-btn', 'navigate(`/doctors/', 'showToast.info('],
    mustNotInclude: ['console.log('],
  },
  {
    file: 'src/pages/doctor/Dashboard.jsx',
    mustInclude: ['setShowAnalytics(true)', 'navigate("/doctor/appointments")', 'analytics-modal'],
    mustNotInclude: ['console.log('],
  },
  {
    file: 'src/pages/doctor/Appointments.jsx',
    mustInclude: ['statusFilter', 'showFilterMenu', 'filter-menu'],
    mustNotInclude: ['console.log('],
  },
  {
    file: 'src/pages/doctor/Availability.jsx',
    mustInclude: ['localStorage', 'availability-summary', 'save-btn'],
    mustNotInclude: ['alert('],
  },
  {
    file: 'src/pages/common/Contact.jsx',
    mustInclude: ['localStorage', 'message has been received', 'support team will respond'],
    mustNotInclude: ['setTimeout('],
  },
  {
    file: 'src/pages/patient/Reports.jsx',
    mustInclude: ['localStorage', 'showToast.success', 'showToast.info'],
    mustNotInclude: ['alert('],
  },
  {
    file: 'src/pages/common/PublicDoctors.jsx',
    mustInclude: ['source: "public-doctor-card"', 'navigate("/patient/book"'],
    mustNotInclude: ['showToast.error("Failed to fetch doctors:", err)'],
  },
  {
    file: 'src/pages/common/DoctorDetails.jsx',
    mustInclude: ['source: "doctor-details"', 'navigate("/patient/book"'],
    mustNotInclude: ['navigate("/patient/book", { state: { doctorId: doctor._id } })'],
  },
  {
    file: 'src/pages/doctor/CompleteDoctorProfile.jsx',
    mustInclude: ['doctor-profile-page', 'doctor-profile-save'],
    mustNotInclude: ['register-container', 'register-form'],
  },
];

const failures = [];

for (const check of checks) {
  const content = await read(check.file);
  for (const token of check.mustInclude || []) {
    if (!content.includes(token)) {
      failures.push(`${check.file} is missing required marker: ${token}`);
    }
  }
  for (const token of check.mustNotInclude || []) {
    if (content.includes(token)) {
      failures.push(`${check.file} still contains blocked pattern: ${token}`);
    }
  }
}

if (failures.length > 0) {
  console.error('UI quality check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`UI quality check passed for ${checks.length} files.`);
