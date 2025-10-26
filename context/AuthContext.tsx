import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  email: string;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (userEmail: string) => {
    setEmail(userEmail);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setEmail('');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ email, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};