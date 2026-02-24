'use client';

import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../components/AuthProvider";
import { validateReservation } from "../lib/validations/reservation"; 
import { sanitizeNameInput, sanitizePhoneInput, validateRealTime } from "../lib/validations";
import { toast } from 'sonner';

const initialFormData = {
    name: '',
    lastName: '',
    phone: '',
    email: '',
    guests: 1,
    date: '',
    time: '',
    mealType: '',
    area: '',
    specialRequests: {
        wheelchairAccessible: false,
        quietZone: false,
        nearWindow: false,
    },
    comments: '',
    acceptPolicies: false,
};

const ReservationsPage = () => {
    // usamos Sonner `toast` para notificaciones
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState(initialFormData);

    const [mealTypes, setMealTypes] = useState<{
        id: number;
        name: string;
        start_time: string; 
        end_time: string;    
        is_active: boolean;
    }[]>([]);

    useEffect(() => {
        fetch('/api/meal_types')
            .then(res => res.json())
            .then(data => setMealTypes(Array.isArray(data) ? data : []))
            .catch(() => setMealTypes([]));
    }, []);

    const [diningAreas, setDiningAreas] = useState<{
        id: number;
        name: string;
        description: string; 
        is_active: boolean;   
    }[]>([]);

    useEffect(() => {
        fetch('/api/dining_areas')
            .then(res => res.json())
            .then(data => setDiningAreas(Array.isArray(data) ? data : []))
            .catch(() => setDiningAreas([]));
    }, []);

    function generateTimeSlots(start: string, end: string, interval = 15) {
        if (!start || !end) return [];
        const startTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
        }
        const slots = [];
        let current = new Date(startTime);
        while (current <= endTime) {
            const hours = current.getHours();
            const minutes = current.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes.toString().padStart(2, '0');
            slots.push(`${displayHours}:${displayMinutes} ${ampm}`);
            current = new Date(current.getTime() + interval * 60000);
        }
        return slots;
    }

    const { user } = useAuth();
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        let newValue = value;

        if (name === "name" || name === "lastName") {
            newValue = sanitizeNameInput(value);
            setErrors((prev) => ({
                ...prev,
                [name]: validateRealTime(name, newValue)
            }));
        } else if (name === "phone") {
            newValue = sanitizePhoneInput(value);
            setErrors((prev) => ({
                ...prev,
                [name]: validateRealTime(name, newValue)
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }

        if (
            type === "checkbox" &&
            ["wheelchairAccessible", "quietZone", "nearWindow"].includes(name)
        ) {
            setFormData((prev) => ({
                ...prev,
                specialRequests: {
                    ...prev.specialRequests,
                    [name]: (e.target as HTMLInputElement).checked,
                },
            }));
        } else if (type === "checkbox" && name === "acceptPolicies") {
            setFormData((prev) => ({
                ...prev,
                acceptPolicies: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: newValue,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateReservation(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const reservationData = {
            user_id: user?.id || null,
            table_id: null,
            date: formData.date,
            time: formData.time,
            people: formData.guests,
            status: 'pendiente',
            meal_type_id: formData.mealType,
            area_preference_id: formData.area,
            special_requests: JSON.stringify(formData.specialRequests),
            comments: formData.comments,
            customer_phone: formData.phone,
            customer_name: `${formData.name} ${formData.lastName}`,
        };

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('¡Reserva realizada con éxito!');
                setFormData((prev) => ({
                    ...prev,
                    guests: 1,
                    date: '',
                    time: '',
                    mealType: '',
                    area: '',
                    specialRequests: {
                        wheelchairAccessible: false,
                        quietZone: false,
                        nearWindow: false,
                    },
                    comments: '',
                    acceptPolicies: false,
                    // Los datos del usuario (name, lastName, phone, email) se mantienen igual
                }));
            } else {
                toast.error('Error al guardar la reserva: ' + (data.error || ""));
            }
        } catch (err) {
            toast.error('Error de conexión al guardar la reserva');
        }
    };

    const renderDetail = (label: string, value: string) => (
        <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="font-semibold">{label}:</div>
            <div>{value || "Falta por completar"}</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Sonner `Toaster` se muestra globalmente en ClientLayout */}
            {/* Sección de Información Básica */}
            <div className="text-center mb-8">
                <img src="/customers/Logo_horizontal.png" alt="Logo del Restaurante" className="mx-auto w-auto h-24 mb-4" />
                <h1 className="text-4xl font-bold text-rose-600">Reserva tu mesa</h1>
                <p className="text-gray-700">Reserva tu mesa para una experiencia culinaria inolvidable</p>
                <p className="text-gray-700">Horario de atención: Lunes a Domingo, 12:00 PM - 10:00 PM</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Apellido"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-700"
                        />
                        {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
                        <div>
                            <div className="flex">
                                <span className="inline-flex items-center px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">+58</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Teléfono de contacto"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded text-gray-700 rounded-r"
                                    required
                                />
                            </div>
                            {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled
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
                    {errors.guests && <span className="text-red-500 text-xs">{errors.guests}</span>}

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">Detalles de la Reserva</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        onFocus={(e) => e.target.blur()}
                                    />
                                    {errors.date && <span className="text-red-500 text-xs">{errors.date}</span>}
                                    <div className="mt-8">
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

                            <div className="w-full">
                                <label className="block text-gray-700 mb-2">Elija el servicio deseado</label>
                                <select
                                    name="mealType"
                                    value={formData.mealType}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setFormData((prev) => ({
                                            ...prev,
                                            mealType: value,
                                            time: "",
                                        }));
                                    }}
                                    className="w-full p-2 border rounded text-gray-700"
                                >
                                    <option value="">Servicio</option>
                                    {mealTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.mealType && <span className="text-red-500 text-xs">{errors.mealType}</span>}
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 mb-2">Selecciona una hora</label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                    disabled={!formData.mealType}
                                >
                                    <option value="">Hora</option>
                                    {formData.mealType && mealTypes.length > 0 && (() => {
                                        const selectedMealType = mealTypes.find(type => type.id.toString() === formData.mealType);
                                        const start = selectedMealType?.start_time ?? "";
                                        const end = selectedMealType?.end_time ?? "";
                                        return generateTimeSlots(start, end).map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ));
                                    })()}
                                </select>
                                {errors.time && <span className="text-red-500 text-xs">{errors.time}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">Preferencias Especiales</h2>
                        <select
                            name="area"
                            value={formData.area}
                            onChange={(e) => {
                                const { value } = e.target;
                                setFormData((prev) => ({
                                    ...prev,
                                    area: value,
                                }));
                            }}
                            className="w-full p-2 border rounded text-gray-700"
                        >
                            <option value="">Selecciona un área</option>
                            {diningAreas.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {formData.area && (
                            <div className="flex items-start gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow-sm my-2">
                                <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                                </svg>
                                <div>
                                    <span className="font-semibold text-yellow-700">Aviso:</span>{" "}
                                    <span className="text-gray-700">
                                        El área seleccionada tiene la siguiente descripción:
                                    </span>
                                    <div className="mt-1 text-gray-800">
                                        {diningAreas.find(area => area.id.toString() === formData.area)?.description ||
                                            'Descripción no disponible'}
                                    </div>
                                </div>
                            </div>
                        )}
                        {errors.area && <span className="text-red-500 text-xs">{errors.area}</span>}

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

                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Detalles de tu Reserva</h2>
                    <div className="border-t border-gray-300 pt-4 space-y-2">
                        {renderDetail("Nombre", formData.name)}
                        {renderDetail("Teléfono", "+58 "+ formData.phone)}
                        {renderDetail("Correo", formData.email)}
                        {renderDetail("Comensales", formData.guests.toString())}
                        {renderDetail("Fecha", formData.date)}
                        {renderDetail("Hora", formData.time)}
                        {renderDetail("Área", formData.area ? diningAreas.find(area => area.id.toString() === formData.area)?.name || "No especificada" : "No especificada")}
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
                    {errors.acceptPolicies && <span className="text-red-500 text-xs">{errors.acceptPolicies}</span>}
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;