import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileScreen({ navigation, route }) {
  // 주소 관련 상태
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 드롭다운 관련 장애 유무
  const [disabilityOpen, setDisabilityOpen] = useState(false);
  const [disability, setDisability] = useState('없음');
  const [disabilityItems, setDisabilityItems] = useState([
    { label: '없음', value: '없음' },
    { label: '있음', value: '있음' }
  ]);

  // 나머지 입력값
  const [job, setJob] = useState('');
  const [income, setIncome] = useState('');
  const [spendingHabit, setSpendingHabit] = useState('');
  const [fixedExpense, setFixedExpense] = useState('');

  // 주소 검색 결과 반영
  useEffect(() => {
    if (route.params?.zonecode) setZonecode(route.params.zonecode);
    if (route.params?.address) setAddress(route.params.address);
  }, [route.params]);

  // 확인 버튼 눌렀을 때 처리
  const onSubmit = () => {
    if (!address || !job || !income || !spendingHabit || !fixedExpense) {
      alert('모든 항목을 입력하세요.');
      return;
    }

    // 입력한 데이터를 객체로 묶어서 마이페이지로 전달하며 이동
    const profileData = {
      address,
      detailAddress,
      zonecode,
      job,
      disability,
      income,
      spendingHabit,
      fixedExpense,
    };

    // 마이페이지로 이동
    navigation.navigate('MyPage', { profileData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원 정보 입력</Text>

      {/* 주소 입력 */}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text>주소</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="주소를 입력하세요"
        />
        <TextInput
          style={styles.input}
          value={detailAddress}
          onChangeText={setDetailAddress}
          placeholder="상세 주소를 입력하세요"
        />
        <TouchableOpacity
          style={[styles.button, { marginTop: 4 }]}
          onPress={() => navigation.navigate('SearchAddress')}
        >
          <Text style={styles.buttonText}>우편번호 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* 직업 */}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text>직업</Text>
        <TextInput
          style={styles.input}
          value={job}
          onChangeText={setJob}
          placeholder="직업을 입력하세요"
        />
      </View>

      {/* 장애유무 드롭다운 */}
      <View style={{ width: '100%', marginBottom: 12, zIndex: 1000 }}>
        <Text>장애 유무</Text>
        <DropDownPicker
          open={disabilityOpen}
          value={disability}
          items={disabilityItems}
          setOpen={setDisabilityOpen}
          setValue={setDisability}
          setItems={setDisabilityItems}
          containerStyle={{ height: 40 }}
          style={{ backgroundColor: '#fafafa' }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
        />
      </View>

      {/* 소득 */}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text>소득</Text>
        <TextInput
          style={styles.input}
          value={income}
          onChangeText={setIncome}
          placeholder="소득을 입력하세요"
          keyboardType="numeric"
        />
      </View>

      {/* 소비 습관 */}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text>소비 습관</Text>
        <TextInput
          style={styles.input}
          value={spendingHabit}
          onChangeText={setSpendingHabit}
          placeholder="소비 습관을 입력하세요"
        />
      </View>

      {/* 고정 지출 */}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text>고정 지출</Text>
        <TextInput
          style={styles.input}
          value={fixedExpense}
          onChangeText={setFixedExpense}
          placeholder="고정 지출을 입력하세요"
          keyboardType="numeric"
        />
      </View>

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
