/**
 * Strips any leading "Dr." or "Dr" or repeated "Dr. Dr." prefixes from a doctor's name.
 * @param {string} name 
 * @returns {string} Cleaned name without Dr. prefix
 */
export const cleanDoctorName = (name) => {
  if (!name || typeof name !== "string") return "";
  return name.replace(/^(Dr\.?\s*)+/i, "").trim();
};

/**
 * Ensures a doctor's name is formatted cleanly with exactly ONE "Dr. " prefix.
 * e.g. "Dr. Amit Sharma" -> "Dr. Amit Sharma"
 * e.g. "Dr. Dr. Amit Sharma" -> "Dr. Amit Sharma"
 * e.g. "Amit Sharma" -> "Dr. Amit Sharma"
 * 
 * @param {string} name 
 * @param {string} fallback 
 * @returns {string} Formatted doctor name with single "Dr. " prefix
 */
export const formatDoctorName = (name, fallback = "Doctor") => {
  if (!name || typeof name !== "string") return fallback;
  const cleaned = cleanDoctorName(name);
  return cleaned ? `Dr. ${cleaned}` : fallback;
};
