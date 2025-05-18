export const validateApiKey = (key: string): boolean => {
  return Boolean(key && key.trim().length > 0);
};

export const validateRequired = (value: string): boolean => {
  return Boolean(value && value.trim().length > 0);
};

export const validateColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};