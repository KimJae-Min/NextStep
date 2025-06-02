//로그인화면

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useThemeMode } from './ThemeContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { darkMode } = useThemeMode();

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('오류', 'ID과 비밀번호를 모두 입력하세요.');
      return;
    }
    navigation.navigate('Profile'); // 로그인 시 프로필 입력 화면으로 이동
  };

  const onSignup = () => {
    navigation.navigate('SignUp');
  };

  // 다크모드 스타일
  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const inputStyle = [
    styles.input,
    darkMode && {
      backgroundColor: '#23262F',
      color: '#fff',
      borderColor: '#444',
    },
  ];
  const buttonStyle = [styles.button, darkMode && { backgroundColor: '#2980b9' }];
  const buttonTextStyle = [styles.buttonText, darkMode && { color: '#fff' }];
  const signupButtonStyle = [styles.signupButton];
  const signupTextStyle = [styles.signupText, darkMode && { color: '#70d7c7' }];

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>로그인</Text>
      <TextInput
        style={inputStyle}
        value={email}
        onChangeText={setEmail}
        placeholder="이메일"
        placeholderTextColor={darkMode ? '#bbb' : '#888'}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={inputStyle}
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        placeholderTextColor={darkMode ? '#bbb' : '#888'}
        secureTextEntry
      />
      <TouchableOpacity style={buttonStyle} onPress={onLogin} activeOpacity={0.85}>
        <Text style={buttonTextStyle}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={signupButtonStyle} onPress={onSignup} activeOpacity={0.8}>
        <Text style={signupTextStyle}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFAFB', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#222' },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#222',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 12,
    padding: 6,
  },
  signupText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
