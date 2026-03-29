'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services/auth.service';
import storage from '@/lib/storage';
import queryClient from '@/lib/react-query';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/services/auth.service';

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasToken = isHydrated && Boolean(storage.getToken());

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getMe,
    retry: false,
    enabled: hasToken,
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
    <AuthContext.Provider
      value={{
        user: hasToken ? user || null : null,
        isLoading: !isHydrated || (hasToken ? isLoading : false),
        isError: hasToken ? isError : false,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
