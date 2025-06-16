'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from './components/AuthProvider';
import Navbar from './components/Navbar';
import GuestMenu from './components/GuestMenu';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <Navbar />
      <main className={`min-h-[calc(100vh-4rem)] ${pathname === '/' ? 'pt-0' : 'pt-0'}`}>
        {children}
      </main>
    </AuthProvider>
  );
}