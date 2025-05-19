//회원가입
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useThemeMode } from './ThemeContext'; // 경로 수정
import { useUser } from './UserContext';       // 경로 수정

export default function SignUpScreen() {
  const { login } = useUser();
  const navigation = useNavigation();
  const { darkMode } = useThemeMode();

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
    login({ name, birth, phone, email, address: '' });
    Alert.alert('회원가입 완료', `${name}님, 환영합니다!`);
    navigation.navigate('설정');
  };

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
      text: darkMode ? '#bbb' : '#222',
      background: darkMode ? '#222' : '#fff',
      placeholder: darkMode ? '#bbb' : '#888',
      primary: darkMode ? '#bbb' : '#222',
    },
  };

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Text style={titleStyle}>회원가입</Text>
      <TextInput label="아이디" value={userId} onChangeText={setUserId} style={styles.input} theme={inputTheme} />
      <TextInput label="비밀번호" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} theme={inputTheme} />
      <TextInput label="비밀번호 확인" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} theme={inputTheme} />
      <TextInput label="이름" value={name} onChangeText={setName} style={styles.input} theme={inputTheme} />
      <TextInput label="생년월일" value={birth} onChangeText={setBirth} style={styles.input} theme={inputTheme} />
      <TextInput label="이메일" value={email} onChangeText={setEmail} style={styles.input} theme={inputTheme} />
      <TextInput label="전화번호" value={phone} onChangeText={setPhone} style={styles.input} theme={inputTheme} />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>회원가입</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#222' },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  button: { marginTop: 16, backgroundColor: '#222' },
});
