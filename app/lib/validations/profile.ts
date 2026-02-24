// Validaciones específicas para el perfil
import { isNumberInRange, isDateBeforeToday } from './common';

export const isValidName = (value: string): boolean => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
};

export const isValidPhone = (value: string): boolean => {
  return /^(\+58)?\d{10}$/.test(value);
};

export const isValidAge = (value: string | number): boolean => {
  return isNumberInRange(value, 18, 100);
};

export const isValidBirthDate = (value: string): boolean => {
  if (!value) return false;
  const input = new Date(value);
  if (isNaN(input.getTime())) return false;
  const today = new Date();
  // Fecha máxima permitida: hoy menos 18 años
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  // Fecha mínima permitida: hoy menos 100 años
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  return input <= maxDate && input >= minDate;
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
    errors.age = 'Edad debe ser entre 18 y 100 años';
  }

  if (!formData.birthDate) {
    errors.birthDate = 'Debes indicar la fecha de nacimiento';
  } else {
    const input = new Date(formData.birthDate);
    if (isNaN(input.getTime())) {
      errors.birthDate = 'Fecha inválida';
    } else {
      const today = new Date();
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      if (input > maxDate) {
        errors.birthDate = 'Debes ser mayor de 18 años';
      } else if (input < minDate) {
        errors.birthDate = 'No se aceptan personas mayores de 100 años';
      }
    }
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
  // Solo números y limita a 3 dígitos para permitir 100
  const num = value.replace(/\D/g, '').slice(0, 3);
  if (num === '') return '';
  const capped = Math.min(Number(num), 100);
  return capped.toString();
};

export const validateRealTime = (name: string, value: string): string => {
  switch (name) {
    case 'name':
    case 'lastName':
      return isValidName(value) ? '' : 'Solo letras y espacios permitidos';
    case 'phone':
      return isValidPhone(value) ? '' : 'Máximo 10 dígitos (ej: 4121234567)';
    case 'age':
      return isValidAge(value) ? '' : 'Debe ser entre 18-100 años';
    case 'birthDate':
      return isValidBirthDate(value) ? '' : 'Fecha debe indicar edad entre 18 y 100 años';
    default:
      return '';
  }
};