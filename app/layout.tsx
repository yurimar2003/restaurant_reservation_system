import type { Metadata, Viewport } from 'next';
import ClientLayout from './ClientLayout';
import './ui/global.css'; // Asegúrate de importar los estilos globales

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'The Best Chef',
  description: 'Sistema de reservas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}




/*   return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className={`min-h-screen ${pathname === '/' ? 'pt-0' : 'pt-16'}`}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  ) */



