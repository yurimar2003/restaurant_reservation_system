import { isValidName, isValidPhone } from "./profile";

export type ReservationErrors = {
  name?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  guests?: string;
  date?: string;
  time?: string;
  mealType?: string;
  area?: string;
  acceptPolicies?: string;
};

export const validateReservation = (formData: {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  mealType: string;
  area: string;
  acceptPolicies: boolean;
}): ReservationErrors => {
  const errors: ReservationErrors = {};

  if (!formData.name || !isValidName(formData.name)) {
    errors.name = 'Debes llenar este campo';
  }

  if (!formData.lastName || !isValidName(formData.lastName)) {
    errors.lastName = 'Debes llenar este campo';
  }
  if (!formData.phone || !isValidPhone(formData.phone)) {
    errors.phone = 'Teléfono inválido (formato: +584121234567)';
  }
  if (!formData.guests || formData.guests < 1 || formData.guests > 10) {
    errors.guests = 'Debe seleccionar entre 1 y 10 comensales';
  }
  if (!formData.date) {
    errors.date = 'Debe seleccionar una fecha';
  }
  if (!formData.mealType) {
    errors.mealType = 'Debe elegir un servicio';
  }
  if (!formData.time) {
    errors.time = 'Debe seleccionar una hora';
  }
  if (!formData.area) {
    errors.area = 'Debe seleccionar un área';
  }
  if (!formData.acceptPolicies) {
    errors.acceptPolicies = 'Debe aceptar las políticas de cancelación';
  }

  return errors;
};