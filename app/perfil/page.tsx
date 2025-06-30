'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import Loading from './loading';
import { sanitizeAgeInput, sanitizeNameInput, sanitizePhoneInput, validateProfile, validateRealTime } from '../lib/validations/profile';


import { 
  isValidPassword,
} from '../lib/validations/index';

// --- Funciones auxiliares ---
function formatDateForInput(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() + timezoneOffset);
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user, isLoading: authLoading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    age: '',
    gender: '',
    birthDate: '',
    location: '',
  });

  // Para el cambio de contraseña
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  // --- Inicialización y redirección ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
        age: user.age ? String(user.age) : '',
        gender: user.gender || '',
        birthDate: user.birthDate ? formatDateForInput(user.birthDate) : '',
        location: user.location || '',
      });
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // --- Manejo de cambios en inputs ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Sanitización en tiempo real
    switch (name) {
      case 'name':
      case 'lastName':
        newValue = sanitizeNameInput(value);
        break;
      case 'phone':
        newValue = sanitizePhoneInput(value);
        break;
      case 'age':
        newValue = sanitizeAgeInput(value);
        break;
    }

    // Actualiza el formulario
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validación en tiempo real con feedback
    if (['name', 'lastName', 'phone', 'age', 'birthDate'].includes(name)) {
      const errorMessage = validateRealTime(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  // --- Validación al enviar ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de todos los campos
    const newErrors = validateProfile(formData);

    // Filtra los valores undefined para cumplir con el tipo esperado por setErrors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, v]) => typeof v === 'string' && v !== undefined)
    ) as { [key: string]: string };
    setErrors(filteredErrors);
    if (Object.keys(filteredErrors).length > 0) return;

    const { success, error } = await updateUser({
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
    });

    if (success) {
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    } else {
      alert(error || 'Error al actualizar el perfil');
      console.error('Detalles del error:', error);
    }
  };

  // --- Cambio de contraseña ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación básica
    if (!isValidPassword(passwords.password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una letra y un número.');
      return;
    }
    if (passwords.password !== passwords.confirm) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmPasswordChange = async () => {
    setShowConfirmModal(false);
    // Llama a updateUser solo con el campo password
    const { success, error } = await updateUser({ password: passwords.password });
    if (success) {
      setIsModalOpen(false);
      setPasswords({ password: '', confirm: '' });
      alert('Contraseña actualizada. Debe iniciar sesión nuevamente.');
      logout();
    } else {
      setPasswordError(error || 'Error al actualizar la contraseña');
    }
  };

  if (authLoading || loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="max-w-3xl w-full mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Perfil de Usuario</h1>
      <div className="flex items-start gap-8 mb-8">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mr-6">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600">
            <circle cx="20" cy="16" r="8" />
            <path d="M6 36c0-5.33 10.67-8 14-8s14 2.67 14 8" />
          </svg>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="name"
              className="border rounded px-2 py-1 w-full"
              value={formData.name}
              onChange={handleChange}
              readOnly={!isEditing}
              autoComplete="off"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              name="lastName"
              className="border rounded px-2 py-1 w-full"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              autoComplete="off"
            />
            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
          </div>
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium mb-1">Número Celular</label>
            <div className="flex">
              <span className="inline-flex items-center px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">+58</span>
              <input
                name="phone"
                className="border rounded-r px-2 py-1 w-full"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                maxLength={10}
                placeholder="Ej: 4121234567"
                autoComplete="off"
              />
            </div>
            {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
          </div>
          {/* Edad */}
          <div>
            <label className="block text-sm font-medium mb-1">Edad</label>
            <input
              type="number"
              name="age"
              className="border rounded px-2 py-1 w-full"
              value={formData.age}
              onChange={handleChange}
              readOnly={!isEditing}
              min={18}
              max={95}
              autoComplete="off"
            />
            {errors.age && <span className="text-red-500 text-xs">{errors.age}</span>}
          </div>
          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium mb-1">Sexo</label>
            <select
              name="gender"
              className="border rounded px-2 py-1 w-full"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="birthDate"
              className="border rounded px-2 py-1 w-full"
              value={formData.birthDate}
              onChange={handleChange}
              readOnly={!isEditing}
              max={formatDateForInput(new Date().toISOString())}
            />
            {errors.birthDate && <span className="text-red-500 text-xs">{errors.birthDate}</span>}
          </div>
          {/* Lugar de residencia */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Lugar de residencia</label>
            <input
              name="location"
              className="border rounded px-2 py-1 w-full"
              value={formData.location}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="border rounded px-2 py-1 w-full bg-gray-100"
              value={formData.email}
              disabled
            />
          </div>
          {/* Rol */}
          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <input
              className="border rounded px-2 py-1 w-full bg-gray-100"
              value={formData.role}
              disabled
            />
          </div>
          {/* Botones */}
          <div className="md:col-span-2 flex gap-4 mt-4">
            {!isEditing ? (
              <button
                type="button"
                className="bg-rose-600 text-white px-6 py-2 rounded"
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="bg-gray-700 text-white px-6 py-2 rounded shadow border border-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  onClick={() => {
                  // Restaurar los datos originales del usuario desde la BD
                  setFormData({
                    name: user?.name || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    role: user?.role || '',
                    phone: user?.phone || '',
                    age: user?.age ? String(user.age) : '',
                    gender: user?.gender || '',
                    birthDate: user?.birthDate ? formatDateForInput(user.birthDate) : '',
                    location: user?.location || '',
                  });
                  setErrors({});
                  setIsEditing(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-2 rounded shadow border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Guardar Cambios
                </button>
              </>
            )}
            <button
              type="button"
              className="bg-rose-600 text-white px-6 py-2 rounded"
              onClick={() => {
                setIsModalOpen(true);
                setPasswords({ password: '', confirm: '' });
                setPasswordError('');
              }}
            >
              Cambiar contraseña
            </button>
          </div>
        </form>
      </div>
      {/* Modal para cambiar contraseña */}
        {isModalOpen && (
          /* bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-4*/
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold mb-2 text-gray-900">Cambiar contraseña</h3>
          <p className="mb-4 text-md text-gray-700">
            Por favor, cambie su contraseña con cuidado. Esta acción no se puede deshacer fácilmente.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              name="password"
              placeholder="Nueva contraseña"
              className="w-full px-4 py-2 my-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={passwords.password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirm"
              placeholder="Confirmar contraseña"
              className="w-full px-4 py-2 my-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              autoComplete="new-password"
            />
            {passwordError && <div className="text-red-500 text-xs mb-2">{passwordError}</div>}
            <div className="flex justify-end mt-4 gap-2">
              <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200"
            onClick={() => {
              setIsModalOpen(false);
              setPasswords({ password: '', confirm: '' });
              setPasswordError('');
            }}
              >
            Cancelar
              </button>
              <button
            type="submit"
            className="px-4 py-2 rounded bg-rose-600 text-white"
              >
            Guardar
              </button>
            </div>
          </form>
            </div>
          </div>
        )}
        {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xs w-full">
            <h4 className="text-lg font-bold mb-4 text-rose-600">¿Está seguro de cambiar la contraseña?</h4>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white"
                onClick={confirmPasswordChange}
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}