import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileScreen({ navigation, route }) {
  // 주소 관련
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 드롭다운 관련
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

  const onSubmit = () => {
    if (!address || !job || !income || !spendingHabit || !fixedExpense) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    alert(
      `주소: ${address} ${detailAddress} (${zonecode})\n직업: ${job}\n장애유무: ${disability}\n소득: ${income}\n소비습관: ${spendingHabit}\n고정지출: ${fixedExpense}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* NextStep 로고 */}
      <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>회원 정보 입력</Text>
      {/* 주소 입력 */}
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="우편번호"
          value={zonecode}
          editable={false}
        />
        <TouchableOpacity
          style={[styles.button, { flex: 1, marginLeft: 8 }]}
          onPress={() => navigation.navigate('SearchAddress')}
        >
          <Text style={styles.buttonText}>우편번호 찾기</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="주소"
        value={address}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="상세주소"
        value={detailAddress}
        onChangeText={setDetailAddress}
      />
      {/* 직업 */}
      <TextInput
        style={styles.input}
        placeholder="직업"
        value={job}
        onChangeText={setJob}
      />
      {/* 장애유무 (드롭다운) */}
      <View style={{ width: '100%', marginBottom: 16, zIndex: 10 }}>
        <Text style={{ fontSize: 16, color: '#555', marginBottom: 8 }}>장애유무</Text>
        <DropDownPicker
          open={disabilityOpen}
          value={disability}
          items={disabilityItems}
          setOpen={setDisabilityOpen}
          setValue={setDisability}
          setItems={setDisabilityItems}
          placeholder="장애유무 선택"
          style={{ borderColor: '#ccc', borderRadius: 8 }}
          dropDownContainerStyle={{ borderColor: '#ccc', borderRadius: 8 }}
        />
      </View>
      {/* 소득 */}
      <TextInput
        style={styles.input}
        placeholder="소득 (예: 월 300만원)"
        value={income}
        onChangeText={setIncome}
        keyboardType="numeric"
      />
      {/* 소비습관 */}
      <TextInput
        style={styles.input}
        placeholder="소비습관 (예: 절약/보통/과소비)"
        value={spendingHabit}
        onChangeText={setSpendingHabit}
      />
      {/* 고정지출 */}
      <TextInput
        style={styles.input}
        placeholder="고정지출 (예: 월세, 보험 등)"
        value={fixedExpense}
        onChangeText={setFixedExpense}
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FBFAFB', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 200, height: 80, marginBottom: 24, marginTop: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { width: '100%', height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#fff' },
  button: { height: 48, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
