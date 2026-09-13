export const roles = ['student', 'university', 'company'];
export const certificateStatuses = ['pending', 'approved', 'rejected'];
export const certificateTypes = ['academic', 'co-curricular', 'extracurricular'];
export const activityTypes = ['co-curricular', 'extracurricular'];

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeEmail(email) {
  return isNonEmptyString(email) ? email.trim().toLowerCase() : '';
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

export function parseNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function requireEnum(value, allowedValues, fieldName, errors) {
  if (!allowedValues.includes(value)) {
    errors.push(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
}

export function requireString(value, fieldName, errors) {
  if (!isNonEmptyString(value)) {
    errors.push(`${fieldName} is required`);
  }
}

export function sendValidationError(res, errors) {
  return res.status(400).json({ success: false, error: errors.join('; ') });
}

export function validateGpa(value, fieldName, errors) {
  const gpa = parseNumber(value);
  if (gpa === null || gpa < 0 || gpa > 4) {
    errors.push(`${fieldName} must be a number between 0 and 4`);
  }
  return gpa;
}

export function validateAcademicYear(value, fieldName, errors) {
  const year = parseInteger(value);
  if (year === null || year < 1 || year > 6) {
    errors.push(`${fieldName} must be an integer between 1 and 6`);
  }
  return year;
}

export function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString).map(item => item.trim());
  }

  if (isNonEmptyString(value)) {
    return value.split(',').filter(isNonEmptyString).map(item => item.trim());
  }

  return [];
}
