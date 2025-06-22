"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ButtonHome from "../components/ButtonHome";
import { FaUserPlus } from "react-icons/fa";

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
        <div className="min-h-screen flex items-center justify-center bg-rose-100">
            <ButtonHome/>
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-rose-600 pl-3.5 pr-2 pt-3 pb-3 rounded-full mb-4">
                        <FaUserPlus className="h-11 w-11 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        Registrate
                    </h1>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                            Primer nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            placeholder="Ingresa tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                            Email<span className="ml-2 text-xs text-gray-400 align-middle">(Este campo no podrás editarlo)</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            placeholder="Ingresa tu email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
                            Confirmar contraseña
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                        className="w-full bg-rose-600 hover:bg-rose-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registrando..." : "Registrarme"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
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