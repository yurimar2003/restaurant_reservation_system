'use client';

import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';
import GuestMenu from './GuestMenu';
import UserMenu from './UserMenu';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Detecta si estamos en una página 404
  const is404 = typeof window !== 'undefined' && 
               document.querySelector('body')?.innerText.includes('404');

  // No mostrar el menú en /login, /register, /LostPassword ni en 404
  const hideMenu = pathname?.includes('login') || 
                  pathname?.includes('register') || 
                  pathname?.includes('LostPassword') || 
                  is404;

  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  if (isLoading) {
    return <div className="h-16"></div>;
  }

  if (hideMenu) {
    return null;
  }

  return user ? 
    <UserMenu scrolled={scrolled} fixed={isHomePage} /> : 
    <GuestMenu scrolled={scrolled} fixed={isHomePage} />;
}