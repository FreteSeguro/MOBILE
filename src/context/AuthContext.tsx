import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
