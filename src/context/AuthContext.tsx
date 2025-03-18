
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  name: string;
  email: string;
  role: string;
  institution: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultUser: User = {
  name: 'Gabriel Ugoline',
  email: 'gabrielugoline@gmail.com',
  role: 'Administrador',
  institution: 'CENAD'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está armazenado no localStorage (simulando persistência)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Validação de login simulada (em um app real, isso seria uma chamada de API)
      if (email === defaultUser.email && password === 'admin') {
        setUser(defaultUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(defaultUser));
        toast.success('Login realizado com sucesso');
        navigate('/dashboard');
      } else {
        toast.error('Credenciais inválidas');
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast.error('Falha no login');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.info('Desconectado com sucesso');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
