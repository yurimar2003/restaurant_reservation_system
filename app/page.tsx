'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import VideoSlider from './components/VideoSlider';
import { useAuth } from './components/AuthProvider';
import { ReserveButton } from './components/ReserveButton';

export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading } = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      // Cambiamos la lógica para usar el 80% del viewport como punto de cambio
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <header className={`fixed top-0 left-0 z-50 w-full shadow-md transition-colors duration-300 ${scrolled ? 'bg-rose-600' : 'bg-transparent'}`}>
      </header>
      <section id="inicio" className="">
      <div className="relative">
            <div className="relative h-screen overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="relative h-full w-full">
                  <VideoSlider/>
                </div>
              </div>
              <ReserveButton className="absolute bottom-6 right-6 z-10 text-white bg-rose-600 hover:bg-rose-700 border border-rose-600 px-4 py-2"
              ButtonName="¡Conoce nuestro modo de reserva!"/>
            </div>
          </div>
          {/* Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-32">
          <div className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
            <img
              src="/customers/reservar_mesa.png"
              alt="Image 1"
              className="object-contain w-full h-66"
            />
            <div className="p-4">
            <h3 className="text-2xl font-bold text-gray-900">Reserva Instantánea, Sin Llamadas</h3>  
            <p className="text-gray-600 text-lg">
              Olvídate de llamar y esperar. Con nuestra plataforma, reservas tu mesa en 3 clicks  
              y recibes confirmación al instante.  
            </p>
            <ReserveButton 
            className="mt-4 text-white bg-rose-600 hover:bg-rose-700 border border-rose-600 px-4 py-2"
            ButtonName="Reservar mesa"/>
            </div>
          </div>
          <div className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
            <img
              src="/customers/menu.png"
              alt="Image 1"
              className="object-contain w-full h-66"
            />
            <div className="p-4">
            <h3 className="text-2xl font-bold text-gray-900">Explora nuestros sabores</h3>  
            <p className="text-gray-600 text-lg">Descubre platos únicos diseñados por el chef. <br /> 
            <span className="text-sm opacity-80">Sin esperas  •  Menú actualizado  •  Ingredientes premium  </span>  
            </p>
            
              <button className="mt-4 text-md font-medium text-white bg-rose-600 hover:bg-rose-700 border border-rose-600 rounded px-4 py-2">
                Ver la carta
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="quienes-somos" className="p-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <div>
          <img
        src="/customers/quienes-somos.jpg"
        alt="Imagen descriptiva"
        className="w-full h-full object-cover mb-6"
          />
        </div>
        {/* Right Side */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900">¿Quienes Somos?</h1>
          <p className="mt-6 text-gray-600">
          Autenticidad y calidad son pilares esenciales de nuestra manera de entender la gastronomía. En cada restaurante italiano de La Tagliatella puedes disfrutar de auténticas pizzas, con más de 12 para elegir. Elige entre una gran variedad de ensaladas, carpaccios, risottos y gratinados.
          <br />
          No te vayas sin probar algunas de nuestras más de 300 combinaciones de pastas y salsas en cada restaurante italiano de La Tagliatella. Y por supuesto, no olvides pedir alguno de nuestros exquisitos postres; tiramisú casero o helados artesanales, entre muchos otros. Todo ello conforma una amplia oferta materializada en generosas raciones que te trasladarán a las regiones italianas del Piamonte, Liguria y Emilia Romagna.
          </p>
          <div className="grid grid-cols-4 gap-14">
            <div className="flex flex-col items-center mt-4">
              <img
                src="/customers/landing-image1.png"
                alt="Imagen 1"
                className="w-18 h-18 rounded-full object-cover"
              />
              <p className="text-sm mt-2 text-center">Chef Ejecutivo Lorenzo Fransheskini</p>
            </div>
            <div className="flex flex-col items-center mt-4">
              <img
                src="/customers/landing-image2.png"
                alt="Imagen 2"
                className="w-22 h-22 rounded-full object-cover"
              />
              <p className="text-sm mt-2 text-center">Director de Servicios Zack Mendel</p>
            </div>
            <div className="flex flex-col items-center mt-4">
              <img
                src="/customers/landing-image3.png"
                alt="Imagen 3"
                className="w-22 h-22 rounded-full object-cover"
              />
              <p className="text-sm mt-2 text-center">Sumiller Eurimar Jaimes</p>
            </div>
            <div className="flex flex-col items-center mt-4">
              <img
                src="/customers/landing-image4.png"
                alt="Imagen 4"
                className="w-22 h-22 rounded-full object-cover"
              />
              <p className="text-sm mt-2 text-center">Sous Chef Jane Doe</p>
            </div>

          </div>
        </div>
      </section>
      <section id="ubicacion" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Map */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154846816!3d37.77492977975971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0e2c4b1%3A0x8c9e7e7b1b1b1b1b!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1697041234567!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          className="w-full h-96"
        ></iframe>
          </div>
          {/* Right Side: Information */}
          <div className="text-center md:text-left">
        <img
          src="/customers/logo_horizontal.png"
          alt="Logo"
          className="mx-auto md:mx-0 mb-6 w-40 h-auto object-contain"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Visítanos</h1>
        <p className="text-lg text-gray-700 mb-4">
          Nos encontramos en una ubicación privilegiada, ideal para disfrutar de una experiencia gastronómica única.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900">Dirección</h2>
          <p className="text-gray-700 text-md mb-2">
            Calle Principal 123, Centro Histórico <br />
            Ciudad, País
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Horario</h2>
          <p className="text-gray-700 text-md">
            Lunes a Viernes: 10:00 AM - 10:00 PM <br />
            Sábado y Domingo: 12:00 PM - 11:00 PM
          </p>
        </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
          <p className="text-gray-400">
            Teléfono: <a href="tel:+123456789" className="text-rose-600 hover:underline">+1 234 567 89</a>
          </p>
          <p className="text-gray-400">
            Email: <a href="mailto:info@latagliatella.com" className="text-rose-600 hover:underline">info@latagliatella.com</a>
          </p>
        </div>
        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Síguenos</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.917c-1.504 0-1.796.715-1.796 1.763v2.31h3.591l-.467 3.622h-3.124V24h6.116C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0z" />
          </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.573 4.897 4.897 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.058 0 14.01-7.513 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
          </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.248 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.248-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.248-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.248 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.756 0 8.332.013 7.052.072 5.773.131 4.548.392 3.467 1.473 2.386 2.554 2.125 3.779 2.066 5.058.013 8.332 0 8.756 0 12s.013 3.668.072 4.948c.059 1.279.321 2.504 1.402 3.585 1.081 1.081 2.306 1.343 3.585 1.402 1.28.059 1.704.072 4.948.072s3.668-.013 4.948-.072c1.279-.059 2.504-.321 3.585-1.402 1.081-1.081 1.343-2.306 1.402-3.585.059-1.28.072-1.704.072-4.948s-.013-3.668-.072-4.948c-.059-1.279-.321-2.504-1.402-3.585-1.081-1.081-2.306-1.343-3.585-1.402C15.668.013 15.244 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
          </svg>
            </a>
          </div>
        </div>
        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-bold mb-4">Suscríbete</h3>
          <p className="text-gray-400 mb-4">Recibe nuestras últimas noticias y promociones directamente en tu correo.</p>
          <form>
            <input
          type="email"
          placeholder="Tu correo electrónico"
          className="w-full px-4 py-2 rounded bg-gray-800 text-gray-300 focus:outline-none"
            />
            <button
          type="submit"
          className="mt-4 w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded"
            >
          Suscribirse
            </button>
          </form>
        </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} La Tagliatella. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
