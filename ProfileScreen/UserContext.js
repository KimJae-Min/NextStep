import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: '',
    birth: '',
    phone: '',
    email: '',
    address: '',
  });

  const login = (userData) => setUser(userData);
  const logout = () => setUser({
    name: '',
    birth: '',
    phone: '',
    email: '',
    address: '',
  });

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
