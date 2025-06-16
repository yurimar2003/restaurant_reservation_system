'use client';

import React, { useState } from "react";
import Link from "next/link";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservationsPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        guests: 1,
        date: "",
        time: "",
        mealType: "",
        area: "",
        specialRequests: {
            wheelchairAccessible: false,
            quietZone: false,
            nearWindow: false,
        },
        comments: "",
        acceptPolicies: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            const { checked } = e.target;
            setFormData((prev) => ({
                ...prev,
                specialRequests: {
                    ...prev.specialRequests,
                    [name]: checked,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.acceptPolicies) {
            alert("Debes aceptar las políticas de cancelación.");
            return;
        }
        console.log("Reserva confirmada:", formData);
    };

    const renderDetail = (label: string, value: string) => (
        <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="font-semibold">{label}:</div>
            <div>{value || "Falta por completar"}</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Sección de Información Básica */}
            <div className="text-center mb-8">
                <img src="/customers/Logo_horizontal.png" alt="Logo del Restaurante" className="mx-auto w-auto h-24 mb-4" />
                <h1 className="text-4xl font-bold text-rose-600">Reserva tu mesa</h1>
                <p className="text-gray-700">Reserva tu mesa para una experiencia culinaria inolvidable</p>
                <p className="text-gray-700">Horario de atención: Lunes a Domingo, 12:00 PM - 10:00 PM</p>
            </div>

            {/* Contenido Dividido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de Reserva */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Datos del Cliente */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">Datos del Cliente</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Teléfono de contacto"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                        />
                        <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} persona{ i > 0 && "s"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Detalles de la Reserva */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">Detalles de la Reserva</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Selector de Fecha */}
                            <div className="w-full">
                                <label className="block text-gray-700 mb-2">Selecciona una fecha</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        placeholder="Fecha"
                                        readOnly
                                        className="w-full p-2 border rounded text-gray-700 cursor-pointer"
                                        onFocus={(e) => e.target.blur()} // Prevent manual typing
                                    />
                                    <div className="mt-2">
                                        <ReactDatePicker
                                            selected={formData.date ? new Date(formData.date) : null}
                                            onChange={(date: Date | null) => {
                                                if (date) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        date: date.toISOString().split("T")[0],
                                                    }));
                                                }
                                            }}
                                            inline
                                            minDate={new Date()}
                                            className="rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Selector de Tipo de Comida */}
                            <div className="w-full">
                                <label className="block text-gray-700 mb-2">Tipo de comida</label>
                                <select
                                    name="mealType"
                                    value={formData.mealType}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setFormData((prev) => ({
                                            ...prev,
                                            mealType: value,
                                            time: "", // Reset time when meal type changes
                                        }));
                                    }}
                                    className="w-full p-2 border rounded text-gray-700"
                                >
                                    <option value="">Tipo de comida</option>
                                    <option value="brunch">Brunch</option>
                                    <option value="lunch">Almuerzo</option>
                                    <option value="dinner">Cena</option>
                                </select>
                            </div>

                            {/* Selector de Hora */}
                            <div className="w-full">
                                <label className="block text-gray-700 mb-2">Selecciona una hora</label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                    disabled={!formData.mealType} // Disable if no meal type is selected
                                >
                                    <option value="">Hora</option>
                                    {formData.mealType === "brunch" && (
                                        <>
                                            <option value="10:30 AM">10:30 AM</option>
                                            <option value="10:45 AM">10:45 AM</option>
                                            <option value="11:00 AM">11:00 AM</option>
                                            <option value="11:15 AM">11:15 AM</option>
                                        </>
                                    )}
                                    {formData.mealType === "lunch" && (
                                        <>
                                            <option value="12:00 PM">12:00 PM</option>
                                            <option value="12:15 PM">12:15 PM</option>
                                            <option value="12:30 PM">12:30 PM</option>
                                            <option value="12:45 PM">12:45 PM</option>
                                            <option value="1:00 PM">1:00 PM</option>
                                            <option value="1:15 PM">1:15 PM</option>
                                            <option value="1:30 PM">1:30 PM</option>
                                        </>
                                    )}
                                    {formData.mealType === "dinner" && (
                                        <>
                                            <option value="7:30 PM">7:30 PM</option>
                                            <option value="7:45 PM">7:45 PM</option>
                                            <option value="8:00 PM">8:00 PM</option>
                                            <option value="8:15 PM">8:15 PM</option>
                                            <option value="8:30 PM">8:30 PM</option>
                                            <option value="8:45 PM">8:45 PM</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            
                        </div>
                    </div>

                    {/* Preferencias Especiales */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">Preferencias Especiales</h2>
                        <select
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                        >
                            <option value="">Selecciona un área</option>
                            <option value="terrace">Terraza</option>
                            <option value="interior">Interior</option>
                            <option value="bar">Barra</option>
                        </select>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="wheelchairAccessible"
                                checked={formData.specialRequests.wheelchairAccessible}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-rose-600"
                            />
                            <label className="text-gray-700">Accesible para silla de ruedas</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="quietZone"
                                checked={formData.specialRequests.quietZone}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-rose-600"
                            />
                            <label className="text-gray-700">Zona tranquila</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="nearWindow"
                                checked={formData.specialRequests.nearWindow}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-rose-600"
                            />
                            <label className="text-gray-700">Cerca de ventana</label>
                        </div>
                        <textarea
                            name="comments"
                            placeholder="Comentarios adicionales"
                            value={formData.comments}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700"
                    >
                        Confirmar Reserva
                    </button>
                </form>

                {/* Detalles de la Reserva */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Detalles de tu Reserva</h2>
                    <div className="border-t border-gray-300 pt-4 space-y-2">
                        {renderDetail("Nombre", formData.name)}
                        {renderDetail("Teléfono", formData.phone)}
                        {renderDetail("Correo", formData.email)}
                        {renderDetail("Comensales", formData.guests.toString())}
                        {renderDetail("Fecha", formData.date)}
                        {renderDetail("Hora", formData.time)}
                        {renderDetail("Área", formData.area)}
                    </div>
                    <div className="border-t border-gray-300 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800">Políticas de Cancelación</h3>
                        <p className="text-sm text-gray-600">
                            Por favor, asegúrate de llegar al menos 10 minutos antes de tu hora reservada. 
                            Las cancelaciones deben realizarse con al menos 24 horas de anticipación.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <input
                            type="checkbox"
                            name="acceptPolicies"
                            checked={formData.acceptPolicies}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    acceptPolicies: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 text-rose-600"
                        />
                        <label className="text-gray-700">Acepto las políticas de cancelación</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;