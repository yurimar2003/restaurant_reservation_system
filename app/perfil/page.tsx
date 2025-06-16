'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import Loading from './loading';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUser } = useAuth();
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

  // Inicializar formData con los datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
        age: user.age ? String(user.age) : '',
        gender: user.gender || '',
        birthDate: user.birthDate || '',
        location: user.location || '',
      });
      setLoading(false);
    }
  }, [user]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validación adicional si es necesaria
  if (!formData.name || !formData.email) {
    alert('Nombre y email son requeridos');
    return;
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <div className="max-w-3xl w-full mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-rose-600">Perfil de Usuario</h1>
      <div className="flex items-start gap-8 mb-8">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mr-6">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600">
            <circle cx="20" cy="16" r="8" />
            <path d="M6 36c0-5.33 10.67-8 14-8s14 2.67 14 8" />
          </svg>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="name"
              className="border rounded px-2 py-1 w-full"
              value={formData.name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              name="lastName"
              className="border rounded px-2 py-1 w-full"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número de identificación</label>
            <input
              name="phone"
              className="border rounded px-2 py-1 w-full"
              value={formData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Edad</label>
            <input
              type="number"
              name="age"
              className="border rounded px-2 py-1 w-full"
              value={formData.age}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="birthDate"
              className="border rounded px-2 py-1 w-full"
              value={formData.birthDate}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="border rounded px-2 py-1 w-full bg-gray-100"
              value={formData.email}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <input
              className="border rounded px-2 py-1 w-full bg-gray-100"
              value={formData.role}
              disabled
            />
          </div>

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
                  style={{ opacity: 1 }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-2 rounded shadow border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                  style={{ opacity: 1 }}
                >
                  Guardar Cambios
                </button>
              </>
            )}
            <button
              type="button"
              className="bg-rose-600 text-white px-6 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Cambiar contraseña
            </button>
          </div>
        </form>
      </div>

      {/* Modal para cambiar contraseña */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2 text-rose-600">Cambiar contraseña</h3>
            <p className="mb-4 text-sm text-gray-700">
              Por favor, cambie su contraseña con cuidado. Esta acción no se puede deshacer fácilmente.
            </p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="border rounded px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-rose-600 text-white"
                onClick={() => setIsModalOpen(false)}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}