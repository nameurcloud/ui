import  { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  // Add more fields if your backend provides them
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login from localStorage token if needed
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token if needed or just assume logged in
      setUser({ email: 'example@email.com' }); // Placeholder
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
