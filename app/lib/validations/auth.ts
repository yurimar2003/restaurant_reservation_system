// Validaciones para autenticación
export const isValidPassword = (value: string): boolean => {
  // Mínimo 8 caracteres, al menos una letra y un número
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
};

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};