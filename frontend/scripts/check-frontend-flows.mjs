import { readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = process.cwd();
const srcRoot = resolve(root, 'src');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(full));
    } else if (/\.(jsx?|css)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = await walk(srcRoot);
const contents = await Promise.all(allFiles.map(async (file) => [file, await readFile(file, 'utf8')]));
const get = (relativePath) => contents.find(([file]) => file.endsWith(relativePath))?.[1] || '';

const requiredFlows = [
  {
    name: 'booking prefill',
    file: 'pages/patient/BookAppointment.jsx',
    patterns: ['useLocation', 'bookingState', 'selectedDoctor', 'rescheduleFromId'],
  },
  {
    name: 'doctor card booking context',
    file: 'pages/common/PublicDoctors.jsx',
    patterns: ['source: "public-doctor-card"', 'navigate("/patient/book"'],
  },
  {
    name: 'doctor detail booking context',
    file: 'pages/common/DoctorDetails.jsx',
    patterns: ['source: "doctor-details"', 'navigate("/patient/book"'],
  },
  {
    name: 'patient reschedule flow',
    file: 'pages/patient/MyAppointments.jsx',
    patterns: ['rescheduleFromId', 'handleReschedule', 'handleViewDetails'],
  },
  {
    name: 'doctor dashboard routing',
    file: 'pages/doctor/Dashboard.jsx',
    patterns: ['navigate("/doctor/appointments")', 'navigate("/doctor/availability")', 'setShowAnalytics(true)'],
  },
  {
    name: 'doctor appointment filter',
    file: 'pages/doctor/Appointments.jsx',
    patterns: ['statusFilter', 'showFilterMenu', 'filter-menu'],
  },
  {
    name: 'contact persistence',
    file: 'pages/common/Contact.jsx',
    patterns: ['localStorage', 'healthazon-contact-messages'],
  },
  {
    name: 'reports persistence',
    file: 'pages/patient/Reports.jsx',
    patterns: ['localStorage', 'healthazon-patient-reports'],
  },
  {
    name: 'availability persistence',
    file: 'pages/doctor/Availability.jsx',
    patterns: ['localStorage', 'healthazon-doctor-availability'],
  },
  {
    name: 'portal shell',
    file: 'layouts/PatientLayout.jsx',
    patterns: ['portal-shell', 'portal-nav-link', 'portal-logout'],
  },
  {
    name: 'portal shell doctor',
    file: 'layouts/DoctorLayout.jsx',
    patterns: ['portal-shell', 'portal-nav-link', 'portal-logout'],
  },
];

const antiPatterns = [
  { label: 'console logging', regex: /console\.log\(/ },
  { label: 'internal anchor links', regex: /<a\s+href="\/(about|contact)[^"]*"/i },
  { label: 'browser alerts', regex: /alert\(/ },
  { label: 'old footer anchors', regex: /href="\/about"|href="\/contact"/i },
];

const layoutStyleChecks = [
  { file: 'layouts/DoctorLayout.jsx', label: 'inline layout styles', regex: /style=\{\{/ },
  { file: 'layouts/PatientLayout.jsx', label: 'inline layout styles', regex: /style=\{\{/ },
];

const failures = [];

for (const item of requiredFlows) {
  const content = get(item.file);
  if (!content) {
    failures.push(`Missing file for ${item.name}: ${item.file}`);
    continue;
  }
  for (const pattern of item.patterns) {
    if (!content.includes(pattern)) {
      failures.push(`${item.file} is missing required flow marker: ${pattern}`);
    }
  }
}

for (const file of allFiles) {
  const content = contents.find(([entry]) => entry === file)?.[1] || '';
  for (const antiPattern of antiPatterns) {
    if (antiPattern.regex.test(content)) {
      failures.push(`${file.replace(root + '/', '')} contains blocked pattern: ${antiPattern.label}`);
    }
  }
}

for (const check of layoutStyleChecks) {
  const content = get(check.file);
  if (check.regex.test(content)) {
    failures.push(`${check.file} still contains blocked pattern: ${check.label}`);
  }
}

if (failures.length > 0) {
  console.error('Frontend flow check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Frontend flow check passed for ${requiredFlows.length} workflow groups across ${allFiles.length} files.`);
