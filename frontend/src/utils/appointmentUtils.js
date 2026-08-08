/**
 * Checks whether an appointment's scheduled date and time has passed compared to local current time.
 * For an appointment at 9:00 AM on 8 August, this returns true starting from 9:00 AM onwards (e.g. 9:00 AM, 9:18 AM, 9:30 AM).
 * 
 * @param {string} dateStr Format: YYYY-MM-DD
 * @param {string} timeStr Format: HH:MM or 12-hour format e.g. "14:30", "09:00", "09:00 AM"
 * @returns {boolean} true if appointment date & time has arrived or passed
 */
export const isAppointmentTimePassed = (dateStr, timeStr) => {
  if (!dateStr) return false;
  
  const now = new Date();
  const cleanDate = String(dateStr || "").split("T")[0].trim();
  let apptHours = 0;
  let apptMinutes = 0;

  if (timeStr && typeof timeStr === "string") {
    const cleanTime = timeStr.trim().toLowerCase();
    const isPM = cleanTime.includes("pm");
    const isAM = cleanTime.includes("am");
    const match = cleanTime.match(/(\d{1,2}):(\d{2})/);

    if (match) {
      apptHours = parseInt(match[1], 10);
      apptMinutes = parseInt(match[2], 10);

      if (isPM && apptHours < 12) apptHours += 12;
      if (isAM && apptHours === 12) apptHours = 0;
    }
  }

  const padH = String(apptHours).padStart(2, "0");
  const padM = String(apptMinutes).padStart(2, "0");

  const isoWithOffset = `${cleanDate}T${padH}:${padM}:00+05:30`;
  const apptDateObj = new Date(isoWithOffset);

  if (!isNaN(apptDateObj.getTime())) {
    return now.getTime() >= apptDateObj.getTime();
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const localTodayStr = `${year}-${month}-${day}`;

  return cleanDate <= localTodayStr;
};
