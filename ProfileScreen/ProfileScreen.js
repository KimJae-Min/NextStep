//회원정보입력

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileScreen({ navigation, route }) {
  // 주소 관련 상태
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 장애 유무 드롭다운 상태
  const [disabilityOpen, setDisabilityOpen] = useState(false);
  const [disability, setDisability] = useState('없음');
  const [disabilityItems, setDisabilityItems] = useState([
    { label: '없음', value: '없음' },
    { label: '있음', value: '있음' }
  ]);

  // 기타 입력값 상태
  const [job, setJob] = useState('');
  const [income, setIncome] = useState('');
  const [fixedExpense, setFixedExpense] = useState('');

  // 주소 검색 결과 반영
  useEffect(() => {
    if (route.params?.zonecode) setZonecode(route.params.zonecode);
    if (route.params?.address) setAddress(route.params.address);
  }, [route.params]);

  // 확인 버튼 눌렀을 때 처리
  const onSubmit = () => {
    if (!address || !job || !income || !fixedExpense) {
      alert('모든 항목을 입력하세요.');
      return;
    }

    const profileData = {
      address,
      detailAddress,
      zonecode,
      job,
      disability,
      income,
      fixedExpense,
    };

    navigation.navigate('Page', { profileData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원 정보 입력</Text>
      
      {/* 주소 입력 */}
      <Text>주소</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SearchAddress')}>
        <TextInput
          style={styles.input}
          value={address}
          placeholder="주소를 입력하세요"
          editable={false}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={detailAddress}
        onChangeText={setDetailAddress}
        placeholder="상세 주소"
      />
      <TextInput
        style={styles.input}
        value={zonecode}
        placeholder="우편번호"
        editable={false}
      />

      {/* 직업 */}
      <Text>직업</Text>
      <TextInput
        style={styles.input}
        value={job}
        onChangeText={setJob}
        placeholder="직업을 입력하세요"
      />

      {/* 장애 유무 드롭다운 */}
      <Text>장애 유무</Text>
      <DropDownPicker
        open={disabilityOpen}
        value={disability}
        items={disabilityItems}
        setOpen={setDisabilityOpen}
        setValue={setDisability}
        setItems={setDisabilityItems}
        style={styles.input}
      />

      {/* 소득 */}
      <Text>월소득</Text>
      <TextInput
        style={styles.input}
        value={income}
        onChangeText={setIncome}
        placeholder="월소득을 입력하세요"
        keyboardType="numeric"
      />

      {/* 고정 지출 */}
      <Text>고정 지출</Text>
      <TextInput
        style={styles.input}
        value={fixedExpense}
        onChangeText={setFixedExpense}
        placeholder="고정 지출을 입력하세요"
        keyboardType="numeric"
      />

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBFAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
