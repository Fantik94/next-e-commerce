'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour l'utilisateur
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// Interface du contexte d'authentification
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider du contexte
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulation de connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Utilisateur simulé
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      
      // Sauvegarder dans localStorage pour persistance
      localStorage.setItem('digitalfada-user', JSON.stringify(mockUser));
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('digitalfada-user');
  };


  // Vérifier l'authentification au chargement
  React.useEffect(() => {
    const savedUser = localStorage.getItem('digitalfada-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('digitalfada-user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
