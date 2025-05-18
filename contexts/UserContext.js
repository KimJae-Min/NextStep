// contexts/UserContext.js
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

  // 로그인(회원가입 완료) 시 사용자 정보 저장
  const login = (userData) => {
    setUser(userData);
  };

  // 로그아웃 시 정보 초기화
  const logout = () => {
    setUser({
      name: '',
      birth: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// 커스텀 훅
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
