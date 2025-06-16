'use client';

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

  return (
    <header className={`w-full shadow-md transition-colors duration-300 ${scrolled ? 'bg-rose-600' : 'bg-transparent'} ${fixed ? 'fixed top-0 left-0 z-50' : 'sticky top-0'}`}>
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <img
            src="/customers/logo_horizontal.png"
            alt="Logo"
            className="h-auto w-36 object-contain mx-auto"  
          />
        </div>
        
        <ul className="flex items-center gap-6">
          <li>
            <Link href="/" className="font-semibold text-white hover:text-blue-500">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/reservations" className="font-semibold text-white hover:text-blue-500">
              ¡Reserva Ahora!
            </Link>
          </li>
          <li>
            <Link href="/perfil" className="font-semibold text-white hover:text-blue-500">
              Mi Perfil
            </Link>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">Hola, {user?.name}</span>
          <button
            onClick={logout}
            className="text-md font-medium text-white hover:text-rose-200 border border-white rounded-full px-4 py-2 transition-all hover:scale-105 hover:shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </header>
  );
}