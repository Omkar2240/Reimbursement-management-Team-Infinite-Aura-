'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services/auth.service';
import storage from '@/lib/storage';
import queryClient from '@/lib/react-query';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  isError: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getMe,
    retry: false
  });

  const logout = () => {
    // Clear token
    storage.clearToken(); // or localStorage.removeItem("accessToken");

    // Clear react-query cache
    queryClient.clear(); // or queryClient.removeQueries(['profile']);

    // Redirect to login
    router.replace('/login');
  };
  return (
    <AuthContext.Provider value={{ user, isLoading, isError, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
