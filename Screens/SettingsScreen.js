import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native'; // 다크모드 감지

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 시스템에서 다크모드 여부 감지
  const systemDarkMode = useColorScheme() === 'dark';

  // 설정 초기화
  useEffect(() => {
    setDarkMode(systemDarkMode);
  }, [systemDarkMode]);

  const toggleNotifications = () => setNotifications(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : null]}>
      <Text style={[styles.title, darkMode ? styles.darkText : null]}>설정</Text>

      <View style={styles.settingRow}>
        <Text style={darkMode ? styles.darkText : null}>알림 받기</Text>
        <Switch value={notifications} onValueChange={toggleNotifications} />
      </View>

      <View style={styles.settingRow}>
        <Text style={darkMode ? styles.darkText : null}>다크모드</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <Button title="로그아웃" onPress={() => alert('로그아웃 되었습니다')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
