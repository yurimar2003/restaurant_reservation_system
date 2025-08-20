'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";

interface Reservation {
  id: number;
  usuario: string;
  numero_celular: string;
  fecha: string;
  hora: string;
  comensales: number;
  tipo_comida: string;
  area_preferencial: string;
  comentario: string;
  estado: string;
}
function formatDate(fecha: string) {
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return fecha;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function formatHour(hora: string) {
  const [h, m] = hora.split(":");
  let hour = parseInt(h, 10);
  const minutes = m;
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minutes}${ampm}`;
}

export default function ReservationsPage() {
  const { user, isLoading  } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading || !user?.id) return; // Espera a que el usuario esté cargado
    setLoading(true);
    fetch(`/api/reservations?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setReservations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, isLoading]);

  return (
    <div>
      <div className="p-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis Reservas</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-rose-100 text-gray-700">
                <th className="py-2 px-3 border-b">Usuario</th>
                <th className="py-2 px-3 border-b">Número celular</th>
                <th className="py-2 px-3 border-b">Fecha</th>
                <th className="py-2 px-3 border-b">Hora</th>
                <th className="py-2 px-3 border-b">Comensales</th>
                <th className="py-2 px-3 border-b">Tipo de comida</th>
                <th className="py-2 px-3 border-b">Área preferencial</th>
                <th className="py-2 px-3 border-b">Comentario</th>
                <th className="py-2 px-3 border-b">Estado</th>
                <th className="py-2 px-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-6">Cargando reservas...</td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6">No hay reservas registradas.</td>
                </tr>
              ) : (
                reservations.map(res => (
                  <tr key={res.id} className="hover:bg-rose-50">
                    <td className="py-2 px-3 border-b">{res.usuario}</td>
                    <td className="py-2 px-3 border-b">{"+58 "+res.numero_celular}</td>
                    <td className="py-2 px-3 border-b">{formatDate(res.fecha)}</td>
                    <td className="py-2 px-3 border-b">{formatHour(res.hora)}</td>
                    <td className="py-2 px-3 border-b">{res.comensales}</td>
                    <td className="py-2 px-3 border-b">{res.tipo_comida}</td>
                    <td className="py-2 px-3 border-b">{res.area_preferencial}</td>
                    <td className="py-2 px-3 border-b">{res.comentario}</td>
                    <td className="py-2 px-3 border-b">{res.estado}</td>
                    <td className="py-2 px-3 border-b flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Solicitar borrado</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>)}