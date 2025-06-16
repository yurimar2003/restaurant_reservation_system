'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

interface ReserveButtonProps {
  className?: string;
  ButtonName?: string;
  href?: string; // Opcional: por si quieres cambiar la ruta
}

export const ReserveButton = ({
  className = '',
  href = '/reservations',
  ButtonName = '',

}: ReserveButtonProps) => {
  const { user, isLoading } = useAuth();

  return (
    <Link href={href}>
      <button
        onClick={(e) => {
          if (!user && !isLoading) {
            e.preventDefault();
            window.location.href = '/login';
          }
        }}
        className={`text-md font-medium rounded ${className}`}
      >
        {ButtonName}
      </button>
    </Link>
  );
};

/*     <button
      className="absolute bottom-6 right-6 z-10 text-md font-medium text-white bg-rose-600 hover:bg-rose-700 border border-rose-600 rounded px-4 py-2"
      onClick={() => alert('¡Reservar mesa!')}
    >
      ¡Reservar mesa!
    </button> */
