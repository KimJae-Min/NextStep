import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useThemeMode } from './ThemeContext';
import { useUser } from './UserContext';

export default function SignUpScreen({ navigation }) {
  const { darkMode } = useThemeMode();
  const { register } = useUser();

  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const onSignUp = () => {
    // 입력값 검사
    if (!name || !birth || !phone || !email || !password || !passwordCheck) {
      Alert.alert('입력 오류', '모든 항목을 입력하세요.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('비밀번호 오류', '비밀번호는 6자리 이상이어야 합니다.');
      return;
    }
    if (password !== passwordCheck) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    // 회원가입(이메일 중복 체크)
    const success = register({ name, birth, phone, email, password });
    if (!success) {
      Alert.alert('회원가입 오류', '이미 가입된 이메일입니다.');
      return;
    }
    Alert.alert('회원가입 완료', '이제 로그인해 주세요.', [
      { text: '확인', onPress: () => navigation.navigate('Login') },
    ]);
  };

  // 스타일
  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const inputStyle = [
    styles.input,
    darkMode && { backgroundColor: '#23262F', color: '#fff', borderColor: '#444' },
  ];
  const buttonStyle = [styles.button, darkMode && { backgroundColor: '#2980b9' }];
  const buttonTextStyle = [styles.buttonText, darkMode && { color: '#fff' }];
  const loginButtonStyle = [styles.loginButton];
  const loginTextStyle = [styles.loginText, darkMode && { color: '#70d7c7' }];

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }}>
        <Text style={titleStyle}>회원가입</Text>
        <TextInput
          style={inputStyle}
          value={name}
          onChangeText={setName}
          placeholder="이름"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
        />
        <TextInput
          style={inputStyle}
          value={birth}
          onChangeText={setBirth}
          placeholder="생년월일 (예: 2000-01-01)"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
        />
        <TextInput
          style={inputStyle}
          value={phone}
          onChangeText={setPhone}
          placeholder="전화번호"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          keyboardType="phone-pad"
        />
        <TextInput
          style={inputStyle}
          value={email}
          onChangeText={setEmail}
          placeholder="아이디"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={inputStyle}
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호 (6자리 이상)"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          secureTextEntry
        />
        <TextInput
          style={inputStyle}
          value={passwordCheck}
          onChangeText={setPasswordCheck}
          placeholder="비밀번호 확인"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          secureTextEntry
        />
        <TouchableOpacity style={buttonStyle} onPress={onSignUp} activeOpacity={0.85}>
          <Text style={buttonTextStyle}>가입하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={loginButtonStyle} onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
          <Text style={loginTextStyle}>이미 계정이 있으신가요? 로그인</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFAFB', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#222', textAlign: 'center', marginTop: 10 },
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
  loginButton: {
    marginTop: 18,
    padding: 6,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
