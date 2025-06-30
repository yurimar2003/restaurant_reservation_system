// Validaciones específicas para el perfil
import { isNumberInRange, isDateBeforeToday } from './common';

export const isValidName = (value: string): boolean => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
};

export const isValidPhone = (value: string): boolean => {
  return /^(\+58)?\d{10}$/.test(value);
};

export const isValidAge = (value: string | number): boolean => {
  return isNumberInRange(value, 18, 95);
};

export const isValidBirthDate = (value: string): boolean => {
  return isDateBeforeToday(value);
};

// Tipo para errores de perfil
export type ProfileErrors = {
  name?: string;
  lastName?: string;
  phone?: string;
  age?: string;
  birthDate?: string;
  email?: string;
  [key: string]: string | undefined;
};

// Función de validación completa
export const validateProfile = (formData: {
  name: string;
  lastName: string;
  phone: string;
  age: string;
  birthDate: string;
  email: string;
}): ProfileErrors => {
  const errors: ProfileErrors = {};

  if (!formData.name || !isValidName(formData.name)) {
    errors.name = 'Debes rellenar el nombre';
  }

  if (!formData.lastName || !isValidName(formData.lastName)) {
    errors.lastName = 'Debes rellenar el apellido';
  }

  if (!formData.phone || !isValidPhone(formData.phone)) {
    errors.phone = 'Teléfono inválido (formato: +584121234567)';
  }

  if (!formData.age || !isValidAge(formData.age)) {
    errors.age = 'Edad debe ser entre 18 y 95 años';
  }

  if (!formData.birthDate || !isValidBirthDate(formData.birthDate)) {
    errors.birthDate = 'Fecha no puede ser futura';
  }

  if (!formData.email || !formData.email.includes('@')) {
    errors.email = 'Email inválido';
  }

  return errors;
};

// Funciones específicas para manejo en tiempo real
export const sanitizeNameInput = (value: string): string => {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

export const sanitizePhoneInput = (value: string): string => {
  // Elimina todo excepto números y limita a 10 dígitos
  return value.replace(/\D/g, '').slice(0, 10);
};

export const sanitizeAgeInput = (value: string): string => {
  // Solo números y limita a 2 dígitos
  const num = value.replace(/\D/g, '').slice(0, 2);
  return num === '' ? '' : Math.min(Number(num), 95).toString();
};

export const validateRealTime = (name: string, value: string): string => {
  switch (name) {
    case 'name':
    case 'lastName':
      return isValidName(value) ? '' : 'Solo letras y espacios permitidos';
    case 'phone':
      return isValidPhone(value) ? '' : 'Máximo 10 dígitos (ej: 4121234567)';
    case 'age':
      return isValidAge(value) ? '' : 'Debe ser entre 18-95 años';
    case 'birthDate':
      return isValidBirthDate(value) ? '' : 'Fecha no puede ser futura';
    default:
      return '';
  }
};