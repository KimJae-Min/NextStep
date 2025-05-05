import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function SignUpScreen() {
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
    Alert.alert('회원가입 완료', `${name}님, 환영합니다!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput label="아이디" value={userId} onChangeText={setUserId} style={styles.input} />
      <TextInput label="비밀번호" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput label="비밀번호 확인" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      <TextInput label="이름" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="생년월일 (YYYYMMDD)" value={birth} onChangeText={setBirth} keyboardType="numeric" style={styles.input} maxLength={8} />
      <TextInput label="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput label="휴대전화 번호" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>회원가입</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 16 },
  button: { marginTop: 16 },
});
