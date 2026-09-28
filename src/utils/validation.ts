/** Shared input checks. Return a user-facing message, or null when valid. */
export const validateEmail = (value: string): string | null => {
  const email = value.trim();
  if (!email) return 'Email is required';
  const parts = email.split('@');
  const local = parts[0];
  const domain = parts[1] || '';
  if (email.length > 254 || parts.length !== 2 || local.length > 64 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      local.startsWith('.') || local.endsWith('.') || local.includes('..') ||
      domain.split('.').some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (value: string): string | null =>
  !value.trim() ? 'Password is required' : null;

export const validateNewPassword = (value: string): string | null =>
  validatePassword(value) || (value.length < 6 ? 'Password must be at least 6 characters' : null);

export const validateConfirmPassword = (password: string, confirmation: string): string | null => {
  if (!confirmation.trim()) return 'Please confirm your password';
  return password !== confirmation ? 'Passwords do not match' : null;
};

export const validateName = (value: string): string | null => {
  if (!value.trim()) return 'Name cannot be empty.';
  if (value.trim().length > 50) return 'Name cannot exceed 50 characters.';
  if (/[\r\n\t]/.test(value)) return 'Name must be on a single line.';
  return null;
};

export const validateBirthdate = (value: string, today = new Date()): string | null => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'Please enter date as MM/DD/YYYY.';
  const [month, day, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (year < 1900 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return 'Please enter a valid birthdate (year 1900 or later).';
  }
  if (date > today) return 'Birthdate cannot be in the future.';
  return null;
};

export const validateText = (value: string, label: string, maxLength: number): string | null => {
  if (!value.trim()) return `${label} is required`;
  return value.trim().length > maxLength ? `${label} cannot exceed ${maxLength} characters` : null;
};
