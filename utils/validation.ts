export const validateApiKey = (key: string, vendor: 'OpenAI' | 'Anthropic'): boolean => {
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return false;
  }

  switch (vendor) {
    case 'OpenAI':
      return /^sk-[a-zA-Z0-9]{32,}$/.test(key.trim());
    case 'Anthropic':
      return /^sk-ant-[a-zA-Z0-9]{32,}$/.test(key.trim());
    default:
      return false;
  }
};

export const validateRequired = (value: string): boolean => {
  return Boolean(value && value.trim().length > 0);
};

export const validateColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return passwordRegex.test(password);
};