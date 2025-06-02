import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useThemeMode } from './ThemeContext';
import { useUser } from './UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation, route }) {
  const { darkMode } = useThemeMode();
  const { updateProfileComplete } = useUser();
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
      Alert.alert('입력 오류', '모든 항목을 입력하세요.');
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
    
    // 프로필 완료 상태 업데이트
    updateProfileComplete(profileData);

    navigation.navigate('Page', { profileData });
  };

  // 다크모드에 따른 스타일 적용
  const containerStyle = [{ flex: 1, backgroundColor: darkMode ? '#181A20' : '#FBFAFB' }];
  const scrollViewStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const labelStyle = [styles.label, darkMode && { color: '#bbb' }];
  const inputStyle = [styles.input, darkMode && { backgroundColor: '#23262F', color: '#fff', borderColor: '#444' }];
  const buttonStyle = [styles.button, darkMode && { backgroundColor: '#2980b9' }];
  const buttonTextStyle = [styles.buttonText, darkMode && { color: '#fff' }];
  const dropdownStyle = [styles.input, darkMode && { backgroundColor: '#23262F', color: '#fff', borderColor: '#444' }];
  const dropdownContainerStyle = { backgroundColor: darkMode ? '#23262F' : '#fff', borderColor: darkMode ? '#444' : '#ccc' };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView
      style={containerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={scrollViewStyle}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={titleStyle}>회원 정보 입력</Text>
        
        {/* 주소 입력 */}
        <Text style={labelStyle}>주소</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchAddress')}>
          <TextInput
            style={inputStyle}
            value={address}
            placeholder="주소를 입력하세요"
            placeholderTextColor={darkMode ? '#bbb' : '#888'}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        <TextInput
          style={inputStyle}
          value={detailAddress}
          onChangeText={setDetailAddress}
          placeholder="상세 주소"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
        />
        <TextInput
          style={inputStyle}
          value={zonecode}
          placeholder="우편번호"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          editable={false}
        />

        {/* 직업 */}
        <Text style={labelStyle}>직업</Text>
        <TextInput
          style={inputStyle}
          value={job}
          onChangeText={setJob}
          placeholder="직업을 입력하세요"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
        />

        {/* 장애 유무 드롭다운 */}
        <Text style={labelStyle}>장애 유무</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={disabilityOpen}
            value={disability}
            items={disabilityItems}
            setOpen={setDisabilityOpen}
            setValue={setDisability}
            setItems={setDisabilityItems}
            style={dropdownStyle}
            dropDownContainerStyle={{ ...dropdownContainerStyle, zIndex: 1000 }}
            textStyle={{ color: darkMode ? '#fff' : '#222' }}
            placeholderStyle={{ color: darkMode ? '#bbb' : '#888' }}
            zIndex={1000}
            zIndexInverse={1000}
            listMode="MODAL"
          />
        </View>

        {/* 월소득 */}
        <Text style={labelStyle}>월소득</Text>
        <TextInput
          style={inputStyle}
          value={income}
          onChangeText={setIncome}
          placeholder="월소득을 입력하세요"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          keyboardType="numeric"
        />

        {/* 고정 지출 */}
        <Text style={labelStyle}>고정 지출</Text>
        <TextInput
          style={inputStyle}
          value={fixedExpense}
          onChangeText={setFixedExpense}
          placeholder="고정 지출을 입력하세요"
          placeholderTextColor={darkMode ? '#bbb' : '#888'}
          keyboardType="numeric"
        />

        {/* 확인 버튼 */}
        <TouchableOpacity style={buttonStyle} onPress={onSubmit}>
          <Text style={buttonTextStyle}>확인</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBFAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#222',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
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
  dropdownContainer: {
    width: '100%',
    zIndex: 1000,
    marginBottom: 12,
  },
});
