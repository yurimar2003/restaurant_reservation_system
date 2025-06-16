"use client";
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';

export default function LostPassword() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-100">
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
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-rose-600 p-3 rounded-full mb-4">
                        <EnvelopeIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        ¿Olvidaste tu contraseña?
                    </h1>
                    <p className="text-gray-500 text-center text-base">
                        No te preocupes te ayudamos a recuperarla. Ingresa tu email y te enviaremos las instrucciones
                    </p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="tu@email.com"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>
                    <hr className="border-t border-gray-200" />
                    <button
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-sm"
                    >
                        Enviar instrucciones
                    </button>
                </form>
                <div className="mt-8 flex flex-col gap-2">
                    <span className="text-gray-500 text-sm flex items-center">
                        — ¿Recordaste tu contraseña?
                    </span>
                </div>
            </div>
        </div>
    );
}