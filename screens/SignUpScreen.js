import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useThemeMode } from '../contexts/ThemeContext'; // 다크모드 Context import
import { useUser } from '../contexts/UserContext';

export default function SignUpScreen() {
  const { login } = useUser();
  const navigation = useNavigation();
  const { darkMode } = useThemeMode(); // 다크모드 상태

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = () => {
    if (!userId || !password || !confirmPassword || !name || !birth || !email || !phone) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    login({
      name,
      birth,
      phone,
      email,
      address: '',
    });
    Alert.alert('회원가입 완료', `${name}님, 환영합니다!`);
    navigation.navigate('설정');
  };

  // 다크모드용 동적 스타일
  const containerStyle = [
    styles.container,
    darkMode && { backgroundColor: '#222' },
  ];
  const titleStyle = [
    styles.title,
    darkMode && { color: '#fff' },
  ];
  const inputTheme = {
  colors: {
    text: darkMode ? '#bbb' : '#222',           // 입력 글자 색
    background: darkMode ? '#222' : '#fff',     // 입력란 배경
    placeholder: darkMode ? '#bbb' : '#888',    // 라벨/플레이스홀더
    primary: darkMode ? '#bbb' : '#222',        // 포커스/테두리
  },
};
  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Text style={titleStyle}>회원가입</Text>
      <TextInput
        label="아이디"
        value={userId}
        onChangeText={setUserId}
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        theme={inputTheme}
      />
      <TextInput
        label="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        theme={inputTheme}
      />
      <TextInput
        label="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        theme={inputTheme}
      />
      <TextInput
        label="이름"
        value={name}
        onChangeText={setName}
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        theme={inputTheme}
      />
      <TextInput
        label="생년월일 (YYYYMMDD)"
        value={birth}
        onChangeText={setBirth}
        keyboardType="numeric"
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        maxLength={8}
        theme={inputTheme}
      />
      <TextInput
        label="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        theme={inputTheme}
      />
      <TextInput
        label="휴대전화 번호"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={[styles.input, darkMode && { backgroundColor: '#222' }]}
        theme={inputTheme}
      />
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={[styles.button, darkMode && { backgroundColor: '#222' }]}
        labelStyle={{ color: '#fff' }}
      >
        회원가입
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#222' },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  button: { marginTop: 16, backgroundColor: '#222' },
});
