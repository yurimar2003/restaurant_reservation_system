"use client";

import { useAuth } from '../components/AuthProvider';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveSession } from '../lib/session';
import { FaUser } from "react-icons/fa";
import ButtonHome from '../components/ButtonHome';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${window.location.origin}/api/auth/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en el login');
            }

             // Guardar sesión y actualizar contexto
            saveSession(data.user);
            login(data.user); // Esto actualiza el contexto de autenticación
    
            // Redirigir a la página principal
            router.push('/');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error en el login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-100">
            <ButtonHome/>
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-rose-600 p-3 rounded-full mb-4">
                        <FaUser className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        Iniciar Sesión
                    </h1>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-rose-600 hover:bg-rose-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-sm"
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    ¿Olvidaste tu contraseña?{' '}
                    <Link href="/LostPassword" className="text-rose-600 hover:underline">
                        Recuperar contraseña
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;