// contexts/UserContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: '',
    birth: '',
    phone: '',
    email: '',
    address: '',
  });

  // 앱 시작 시 AsyncStorage에서 데이터 불러오기
  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {
        console.warn('사용자 정보 불러오기 실패:', e);
      }
    };
    loadUser();
  }, []);

  // 로그인(회원가입/수정) 시 Context와 AsyncStorage에 저장
  const login = async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.warn('사용자 정보 저장 실패:', e);
    }
  };

  // 로그아웃 시 Context와 AsyncStorage 모두 초기화
  const logout = async () => {
    setUser({
      name: '',
      birth: '',
      phone: '',
      email: '',
      address: '',
    });
    try {
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.warn('사용자 정보 삭제 실패:', e);
    }
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
