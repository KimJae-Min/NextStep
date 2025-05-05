import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function AIPolicyScreen() {
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [result, setResult] = useState('');

  const recommendPolicy = () => {
    if (age && job) {
      // 간단한 예시 로직
      if (parseInt(age) < 30 && job === '학생') {
        setResult('청년 장학금 정책을 추천합니다.');
      } else {
        setResult('지역 일자리 지원 정책을 추천합니다.');
      }
    } else {
      setResult('나이와 직업을 입력해주세요.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI 정책 추천</Text>
      <TextInput
        style={styles.input}
        placeholder="나이를 입력하세요"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="직업을 입력하세요 (예: 학생, 무직, 프리랜서)"
        value={job}
        onChangeText={setJob}
      />
      <Button title="정책 추천받기" onPress={recommendPolicy} />
      <Text style={styles.result}>{result}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
