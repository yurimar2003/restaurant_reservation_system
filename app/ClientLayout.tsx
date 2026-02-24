'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from './components/AuthProvider';
import Navbar from './components/Navbar';
import GuestMenu from './components/GuestMenu';
import { Toaster } from 'sonner';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Navbar />
      <main className={`min-h-[calc(100vh-4rem)] ${pathname === '/' ? 'pt-0' : 'pt-0'}`}>
        {children}
      </main>
    </AuthProvider>
  );
}