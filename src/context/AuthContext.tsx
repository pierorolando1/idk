import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAsUser, loginAsAdmin } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'usuario' | 'admin' | null;
  userId: string | null;
  login: (type: 'usuario' | 'admin', credentials: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  userId: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'usuario' | 'admin' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUserType = localStorage.getItem('userType');
    const savedUserId = localStorage.getItem('userId');
    
    if (savedUserType && (savedUserType === 'usuario' || savedUserType === 'admin')) {
      setIsAuthenticated(true);
      setUserType(savedUserType);
      setUserId(savedUserId);
    }
  }, []);

  const login = async (type: 'usuario' | 'admin', credentials: any): Promise<boolean> => {
    try {
      if (type === 'usuario') {
        const userId = await loginAsUser(credentials);
        setIsAuthenticated(true);
        setUserType('usuario');
        setUserId(userId);
        localStorage.setItem('userType', 'usuario');
        localStorage.setItem('userId', userId);
        return true;
      } else {
        await loginAsAdmin(credentials);
        setIsAuthenticated(true);
        setUserType('admin');
        setUserId('admin');
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userId', 'admin');
        return true;
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserId(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};