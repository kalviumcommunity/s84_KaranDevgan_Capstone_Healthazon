/**
 * Checks whether an appointment's scheduled date and time has passed compared to local current time.
 * @param {string} dateStr Format: YYYY-MM-DD
 * @param {string} timeStr Format: HH:MM or 12-hour format e.g. "14:30", "09:00", "02:30 PM"
 * @returns {boolean} true if appointment date & time has arrived or passed
 */
export const isAppointmentTimePassed = (dateStr, timeStr) => {
  if (!dateStr) return false;
  
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  // Same day check
  if (timeStr && typeof timeStr === "string") {
    let hours = 0;
    let minutes = 0;

    const cleanTime = timeStr.trim().toLowerCase();
    const isPM = cleanTime.includes("pm");
    const isAM = cleanTime.includes("am");
    const digitsMatch = cleanTime.match(/(\d{1,2}):(\d{2})/);

    if (digitsMatch) {
      hours = parseInt(digitsMatch[1], 10);
      minutes = parseInt(digitsMatch[2], 10);

      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }

    const apptTimeMinutes = hours * 60 + minutes;
    const nowTimeMinutes = now.getHours() * 60 + now.getMinutes();

    return apptTimeMinutes <= nowTimeMinutes;
  }

  return true;
};
