import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Button, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext'; // Context import

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useUser(); // Context에서 user 정보와 logout 함수 사용
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleNotifications = () => setNotifications(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 내 정보(마이페이지)로 이동
  const goToMyInfo = () => {
    navigation.navigate('MyPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <Text style={styles.userName}>{user.name || '이름 없음'}</Text>

      {/* 내정보 한 줄만, 주소관리 설명 포함 */}
      <TouchableOpacity style={styles.infoRow} onPress={goToMyInfo}>
        <View>
          <Text style={styles.infoLabel}>내 정보</Text>
          <Text style={styles.infoSubLabel}>이름, 연락처, 이메일, 주소 관리 등</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#888" />
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.settingRow}>
        <Text>알림 받기</Text>
        <Switch value={notifications} onValueChange={toggleNotifications} />
      </View>
      <View style={styles.settingRow}>
        <Text>다크모드</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="로그아웃" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 56,
    backgroundColor: '#E9F3E0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  infoSubLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 36,
  },
});
