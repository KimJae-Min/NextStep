//설정
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Button, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useThemeMode } from './ThemeContext';
import { useUser } from './UserContext';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useUser();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [notifications, setNotifications] = useState(true);

  const toggleNotifications = () => setNotifications(prev => !prev);

  const goToMyInfo = () => {
    navigation.navigate('MyPage');
  };

  const containerStyle = [
    styles.container,
    darkMode && { backgroundColor: '#222' },
  ];
  const titleStyle = [
    styles.title,
    darkMode && { color: '#fff' },
  ];
  const userNameStyle = [
    styles.userName,
    darkMode && { color: '#fff' },
  ];

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>설정</Text>
      <Text style={userNameStyle}>{user.name || '이름 없음'}</Text>
      <TouchableOpacity style={styles.infoRow} onPress={goToMyInfo}>
        <Text style={styles.infoLabel}>내 정보</Text>
        <Text style={styles.infoSubLabel}>이름, 연락처, 이메일, 주소 관리 등</Text>
      </TouchableOpacity>
      <View style={styles.settingRow}>
        <Text style={styles.infoLabel}>알림 받기</Text>
        <Switch value={notifications} onValueChange={toggleNotifications} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.infoLabel}>다크모드</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="로그아웃" onPress={logout} color="#f55" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 56, backgroundColor: '#E9F3E0' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, textAlign: 'left', color: '#222' },
  userName: { fontSize: 20, fontWeight: '600', marginBottom: 20, color: '#222' },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f6fa', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 24 },
  infoLabel: { fontSize: 16, fontWeight: '500', color: '#222' },
  infoSubLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  buttonContainer: { marginTop: 36 },
});
