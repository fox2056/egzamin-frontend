import React from 'react';
import { User } from '@/lib/types';
import { getUser, logout as logoutApi } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  });

  const handleLogout = () => {
    queryClient.clear();
    logoutApi();
  };

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      isLoading,
      logout: handleLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 