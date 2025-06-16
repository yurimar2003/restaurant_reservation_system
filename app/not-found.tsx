import { FaPlugCircleXmark } from "react-icons/fa6";


export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-rose-100">
      <div className="bg-white/20 rounded-3xl px-8 py-12 shadow-xl flex flex-col items-center backdrop-blur-sm">
        <FaPlugCircleXmark size={120} className="text-rose-600 mb-4" />
        <h1 className="text-6xl font-bold m-0">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Página no encontrada</h2>
        <p className="text-base opacity-85 mb-0 text-center">
          La ruta a la que intentas acceder no existe.
        </p>
      </div>
    </main>
  );
}
