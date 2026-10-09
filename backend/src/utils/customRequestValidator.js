import { detectFileType } from "./fileType.js";

const str = (v, max) => String(v ?? "").trim().slice(0, max);

function isValidDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) return false;
  if (d.getUTCFullYear() < 1900) return false;
  return d.getTime() <= Date.now() + 24 * 60 * 60 * 1000; // timezone ka 1 din ka margin
}

/**
 * Frontend ke validateDetails se same rules. Server par dobara zaroori hai,
 * kyunki frontend ki checking koi bhi bypass kar sakta hai.
 * Returns { errors, value, fileMime }
 */
export function validateRequest(raw, file) {
  const d = raw && typeof raw === "object" ? raw : {};
  const errors = {};

  const value = {
    submissionId: str(d.submissionId, 64),
    fullName: str(d.fullName, 100),
    gender: str(d.gender, 10),
    phone: String(d.phone ?? "").replace(/\D/g, ""),
    whatsappSameAsPhone: d.whatsappSameAsPhone !== false,
    email: str(d.email, 254).toLowerCase(),
    kundliMode: d.kundliMode === "upload" ? "upload" : d.kundliMode === "manual" ? "manual" : "",
    dob: str(d.dob, 10),
    timeOfBirth: str(d.timeOfBirth, 5),
    timeUnknown: d.timeUnknown === true,
    placeOfBirth: str(d.placeOfBirth, 200),
    notes: str(d.notes, 500),
    consent: d.consent === true,
  };

  if (!/^[A-Za-z0-9-]{8,64}$/.test(value.submissionId)) errors.submissionId = "Invalid request. Please refresh and try again.";

  if (value.fullName.length < 2) errors.fullName = "Enter the full name.";
  if (!["female", "male", "other"].includes(value.gender)) errors.gender = "Select a gender.";
  if (!/^[6-9]\d{9}$/.test(value.phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.email)) errors.email = "Enter a valid email.";
  if (!value.kundliMode) errors.kundliMode = "Choose how to share your kundli.";

  let fileMime = null;

  if (value.kundliMode === "manual") {
    if (!isValidDate(value.dob)) errors.dob = "Enter a valid date of birth.";
    if (value.timeUnknown) {
      value.timeOfBirth = "";
    } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value.timeOfBirth)) {
      errors.timeOfBirth = "Enter a valid time of birth.";
    }
    if (!value.placeOfBirth) errors.placeOfBirth = "Enter the place of birth.";
  } else if (value.kundliMode === "upload") {
    // Upload mode me manual fields ka koi matlab nahi
    value.dob = "";
    value.timeOfBirth = "";
    value.timeUnknown = false;
    value.placeOfBirth = "";

    if (!file) {
      errors.kundliFile = "Upload your kundli.";
    } else {
      fileMime = detectFileType(file.buffer);
      if (!fileMime) errors.kundliFile = "Upload a PDF, JPG, PNG or WebP file.";
    }
  }

  if (value.notes.length < 10) errors.notes = "Add a little more detail about your problem (at least 10 characters).";
  if (!value.consent) errors.consent = "Please give consent to share your details with the astrologer.";

  return { errors, value, fileMime };
}