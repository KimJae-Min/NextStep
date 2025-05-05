import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function MyPageScreen({ navigation, route }) {
  const initialData = route.params?.profileData || {};

  const [address, setAddress] = useState(initialData.address || '');
  const [detailAddress, setDetailAddress] = useState(initialData.detailAddress || '');
  const [zonecode, setZonecode] = useState(initialData.zonecode || '');
  const [job, setJob] = useState(initialData.job || '');
  const [disability, setDisability] = useState(initialData.disability || '없음');
  const [income, setIncome] = useState(initialData.income || '');
  const [spendingHabit, setSpendingHabit] = useState(initialData.spendingHabit || '');
  const [fixedExpense, setFixedExpense] = useState(initialData.fixedExpense || '');

  const onSave = () => {
    if (!address || !job || !income || !spendingHabit || !fixedExpense) {
      Alert.alert('오류', '모든 항목을 입력하세요.');
      return;
    }

    // 저장 처리 (예: 서버 API 호출 등) 후 사용자에게 알림
    Alert.alert('저장 완료', '프로필 정보가 수정되었습니다.');

    // 필요시 이전 화면으로 돌아가기
    // navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>마이페이지 - 프로필 수정</Text>

      <Text>주소</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text>상세 주소</Text>
      <TextInput style={styles.input} value={detailAddress} onChangeText={setDetailAddress} />

      <Text>우편번호</Text>
      <TextInput style={styles.input} value={zonecode} onChangeText={setZonecode} />

      <Text>직업</Text>
      <TextInput style={styles.input} value={job} onChangeText={setJob} />

      <Text>장애 유무</Text>
      <TextInput style={styles.input} value={disability} onChangeText={setDisability} />

      <Text>소득</Text>
      <TextInput style={styles.input} value={income} onChangeText={setIncome} />

      <Text>소비 습관</Text>
      <TextInput style={styles.input} value={spendingHabit} onChangeText={setSpendingHabit} />

      <Text>고정 지출</Text>
      <TextInput style={styles.input} value={fixedExpense} onChangeText={setFixedExpense} />

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FBFAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
