export const validateApiKey = (key: string): boolean => {
  // Add your API key validation logic here
  return key.length > 0;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateColor = (color: string): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};