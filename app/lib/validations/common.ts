// Validaciones básicas reutilizables
export const isRequired = (value: string): boolean => {
  return value.trim() !== '';
};

export const minLength = (value: string, length: number): boolean => {
  return value.length >= length;
};

export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length;
};

export const isNumberInRange = (
  value: string | number, 
  min: number, 
  max: number
): boolean => {
  const num = typeof value === 'string' ? Number(value) : value;
  return !isNaN(num) && num >= min && num <= max;
};

export const isDateBeforeToday = (value: string): boolean => {
  if (!value) return false;
  const today = new Date();
  const inputDate = new Date(value);
  return inputDate <= today;
};