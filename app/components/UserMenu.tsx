'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function UserMenu({ 
  scrolled, 
  fixed 
}: { 
  scrolled: boolean; 
  fixed: boolean; 
}) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`w-full shadow-md transition-colors duration-300 ${scrolled ? 'bg-rose-600' : 'bg-transparent'} ${fixed ? 'fixed top-0 left-0 z-50' : 'sticky top-0'}`}>
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <img
            src="/customers/logo_horizontal.png"
            alt="Logo"
            className="h-auto w-36 object-contain mx-auto"  
          />
            <Link href="/create-reservations" className="hidden md:inline-flex text-md font-medium text-white border border-white rounded-full px-4 py-2 mx-5 transition-all hover:scale-105 hover:shadow-lg">
              ¡Reserva Ahora!
            </Link>
        </div>
        
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link href="/" className="font-semibold text-white hover:text-rose-200">
              Inicio
            </Link>
          </li>
{/*           <li>
            <Link href="/create-reservations" className="font-semibold text-white hover:text-rose-200">
              ¡Reserva Ahora!
            </Link>
          </li> */}
          <li>
            <Link href="/perfil" className="font-semibold text-white hover:text-rose-200">
              Perfil
            </Link>
          </li>
          <li>
            <Link href="/reservations" className="font-semibold text-white hover:text-rose-200">
              Mis reservas
            </Link>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            {/* Botón hamburguesa solo en móvil */}
            <button
              className="p-2 rounded text-white hover:text-rose-200"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-white font-medium">Hola, {user?.name}</span>
            <button
              onClick={logout}
              className="text-md font-medium text-white border border-white rounded-full px-4 py-2 transition-all hover:scale-105 hover:shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      {/* Menú móvil overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] flex">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)} />
          <aside className="relative ml-auto w-64 h-full bg-rose-600 text-white p-6 flex flex-col shadow-xl">
            <button className="self-end mb-4 p-2" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-lg font-semibold" onClick={() => setMobileOpen(false)}>Inicio</Link>
              <Link href="/create-reservations" className="text-lg font-semibold" onClick={() => setMobileOpen(false)}>¡Reserva Ahora!</Link>
              <Link href="/perfil" className="text-lg font-semibold" onClick={() => setMobileOpen(false)}>Perfil</Link>
              <Link href="/reservations" className="text-lg font-semibold" onClick={() => setMobileOpen(false)}>Mis reservas</Link>
            </nav>
            <div className="mt-auto">
              <div className="mb-4">Hola, {user?.name}</div>
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className="w-full text-left bg-white text-rose-600 px-3 py-2 rounded"
              >
                Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}