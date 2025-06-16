'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSession, clearSession, saveSession } from '../lib/session';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
  lastName?: string;
  email: string;
  role: string;
  phone?: string;
  age?: number;
  gender?: string;
  birthDate?: string;
  location?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = getSession();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    saveSession(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    fetch('/api/auth/logout', { method: 'POST' })
      .catch(err => console.error('Error al cerrar sesión:', err));
    router.push('/');
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' };

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...updatedData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Error desconocido' };
      }

      // Actualizar el estado local
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      saveSession(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}