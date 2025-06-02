import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  // 여러 명의 회원 정보 관리
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null); // 현재 로그인한 사용자

  // 회원가입: 같은 이메일이 이미 있으면 실패, 아니면 추가
  const register = (userData) => {
    const exists = users.some(u => u.email === userData.email);
    if (exists) return false; // 이미 가입된 이메일
    setUsers(prev => [...prev, userData]);
    return true;
  };

  // 로그인: users 배열에서 이메일/비밀번호 일치하는 회원만 로그인
  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return found; // 사용자 정보 반환
    }
    return null; // 로그인 실패
  };
  
  // 프로필 완료 상태 업데이트
  const updateProfileComplete = (profileData) => {
    // 현재 로그인한 사용자의 프로필 정보 업데이트
    if (user) {
      const updatedUser = { ...user, profileComplete: true, profileData };
      setUser(updatedUser);
      
      // users 배열에서도 해당 사용자 정보 업데이트
      setUsers(prev => prev.map(u => 
        u.email === user.email ? updatedUser : u
      ));
    }
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, users, register, login, logout, updateProfileComplete }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
