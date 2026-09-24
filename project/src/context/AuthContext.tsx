import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '@/services/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  department: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, department: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('campusos_token');
    const storedUser = localStorage.getItem('campusos_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await authService.login(email, password);
    localStorage.setItem('campusos_token', res.token);
    const userData: User = {
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
      department: res.department,
    };
    localStorage.setItem('campusos_user', JSON.stringify(userData));
    setUser(userData);
  }

  async function register(name: string, email: string, password: string, role: string, department: string) {
    const res = await authService.register(name, email, password, role, department);
    localStorage.setItem('campusos_token', res.token);
    const userData: User = {
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
      department: res.department,
    };
    localStorage.setItem('campusos_user', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('campusos_token');
    localStorage.removeItem('campusos_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
