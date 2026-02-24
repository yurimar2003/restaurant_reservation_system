// Validaciones para autenticación
export const isValidPassword = (value: string): boolean => {
  // Mínimo 8 caracteres, al menos una letra, un número y un carácter especial
  // Permite cualquier carácter, pero exige: 1 letra, 1 dígito y 1 no alfanumérico
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
};

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};