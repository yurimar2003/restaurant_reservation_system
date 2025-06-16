"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
      
        // Validaciones
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }
      
        setIsLoading(true);
      
        try {
          // URL ABSOLUTA - solución clave
          const response = await fetch(`${window.location.origin}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password
            }),
          });
      
          // Debug: muestra la respuesta completa
          console.log("Status:", response.status);
          const textResponse = await response.text();
          console.log("Raw response:", textResponse);
      
          // Intenta parsear JSON solo si la respuesta es válida
          const data = textResponse ? JSON.parse(textResponse) : {};
      
          if (!response.ok) {
            throw new Error(data.error || 'Error en el registro');
          }
      
          // Éxito
          console.log('Registro exitoso:', data);
          router.push('/login?registered=true');
          
        } catch (err) {
          console.error('Error completo:', err);
          setError(err instanceof Error ? err.message : 'Error en el registro');
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/customers/login-background.jpg')",
            }}>
            {/* Botón de atrás */}
            <button
                type="button"
                onClick={() => router.push('/')}
                className="absolute top-6 left-6 z-20 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
                aria-label="Volver al inicio"
            >
                <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
                <h1 className="text-2xl font-bold text-center text-rose-600 mb-6">Regístrate</h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                            Nombre y Apellido
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-600 focus:border-rose-600"
                            placeholder="Ingresa tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-600 focus:border-rose-600"
                            placeholder="Ingresa tu email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-600 focus:border-rose-600"
                            placeholder="Ingresa tu contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                            Confirmar Contraseña
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-600 focus:border-rose-600"
                            placeholder="Confirma tu contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registrando..." : "Registrarme"}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    ¿Ya estás registrado?{" "}
                    <Link
                        href="/login"
                        className="text-rose-600 hover:underline">
                        Iniciar Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;