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
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const localTodayStr = `${year}-${month}-${day}`;

  const cleanDateStr = String(dateStr || "").split("T")[0].trim();

  if (cleanDateStr < localTodayStr) return true;
  if (cleanDateStr > localTodayStr) return false;

  // Same day check: starting from the scheduled appointment hour/minute onwards
  if (timeStr && typeof timeStr === "string") {
    let apptHours = 0;
    let apptMinutes = 0;

    const cleanTime = timeStr.trim().toLowerCase();
    const isPM = cleanTime.includes("pm");
    const isAM = cleanTime.includes("am");
    const digitsMatch = cleanTime.match(/(\d{1,2}):(\d{2})/);

    if (digitsMatch) {
      apptHours = parseInt(digitsMatch[1], 10);
      apptMinutes = parseInt(digitsMatch[2], 10);

      if (isPM && apptHours < 12) apptHours += 12;
      if (isAM && apptHours === 12) apptHours = 0;
    }

    const apptTimeMinutes = apptHours * 60 + apptMinutes;
    const nowTimeMinutes = now.getHours() * 60 + now.getMinutes();

    return apptTimeMinutes <= nowTimeMinutes;
  }

  return true;
};
