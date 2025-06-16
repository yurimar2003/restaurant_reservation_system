import Link from 'next/link';
import { ReserveButton } from './ReserveButton';

export default function GuestMenu({ 
  scrolled, 
  fixed 
}: { 
  scrolled: boolean; 
  fixed: boolean; 
}) {
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
            <a href="#quienes-somos" className="font-semibold text-white hover:text-blue-500">
              Quienes somos
            </a>
          </li>
          <li>
            <a href="#ubicacion" className="font-semibold text-white hover:text-blue-500">
              Ubicación
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <ReserveButton 
          className=" text-rose-600 bg-white hover:bg-white-700 border border-white px-3 py-1"
          ButtonName="¡Reservar mesa!"/>
          <Link
            href="/login"
            className="text-md font-medium text-white hover:text-blue-500 border border-white rounded px-3 py-1 transition-all">
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="text-md font-medium text-white hover:text-blue-500 border border-white rounded px-3 py-1 transition-all">        
            Regístrate
          </Link>
        </div>
      </nav>
    </header>
  );
}