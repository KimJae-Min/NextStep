// Page.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const windowHeight = Dimensions.get('window').height;

export default function Page() {
  const navigation = useNavigation();
  const [income, setIncome] = useState('');
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('홈');
  const [useBankConnection, setUseBankConnection] = useState(true);

  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('05');
  const [selectedDay, setSelectedDay] = useState('01');
  const [isSpendingModalVisible, setSpendingModalVisible] = useState(false);
  const [inputSpending, setInputSpending] = useState('');
  const [spendingRecords, setSpendingRecords] = useState({});

  const spendingTotal = Object.values(spendingRecords).reduce((acc, cur) => acc + cur, 0);
  const spendingPercent = (spendingTotal / 100000) * 100;

  const recommendPolicy = income > 2500 ? '주거 지원 정책 추천' : '일반 지원 정책 추천';
  const formattedIncome = income ? `${income}만원` : '';

  const getRiskColor = () => {
    if (spendingPercent > 80) return 'red';
    if (spendingPercent > 30) return 'orange';
    return 'green';
  };

  const saveIncome = () => {
    if (income !== '') setIsDialOpen(false);
  };

  const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;

  const addSpending = () => {
    if (inputSpending !== '') {
      setSpendingRecords(prev => ({
        ...prev,
        [formattedDate]: parseInt(inputSpending, 10)
      }));
      setInputSpending('');
      setSpendingModalVisible(false);
    }
  };

  const SpendingPlanner = () => (
    <View style={styles.spendingPlannerBox}>
      <Text style={styles.title}>지출 플래너</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Picker selectedValue={selectedYear} style={{ height: 40, width: 100 }} onValueChange={v => setSelectedYear(v)}>
          <Picker.Item label="2025" value="2025" />
          <Picker.Item label="2024" value="2024" />
        </Picker>
        <Picker selectedValue={selectedMonth} style={{ height: 40, width: 80 }} onValueChange={v => setSelectedMonth(v)}>
          {[...Array(12)].map((_, i) => {
            const month = (i + 1).toString().padStart(2, '0');
            return <Picker.Item key={month} label={month} value={month} />;
          })}
        </Picker>
        <Picker selectedValue={selectedDay} style={{ height: 40, width: 80 }} onValueChange={v => setSelectedDay(v)}>
          {[...Array(31)].map((_, i) => {
            const day = (i + 1).toString().padStart(2, '0');
            return <Picker.Item key={day} label={day} value={day} />;
          })}
        </Picker>
        <TouchableOpacity onPress={() => setSpendingModalVisible(true)} style={{ marginLeft: 10, backgroundColor: '#ccc', padding: 8, borderRadius: 6 }}>
          <Text>금액 입력</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 10, maxHeight: 150 }}>
        <Text style={styles.text}>{formattedDate}: {spendingRecords[formattedDate]?.toLocaleString() || '0'}원</Text>
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.navigate('지출위험도설명')} activeOpacity={0.8} style={{ marginTop: 20 }}>
        <View style={[styles.progressBar, { backgroundColor: getRiskColor(), width: `${spendingPercent}%` }]}>
          <Text style={styles.progressText}>{`위험도: ${Math.round(spendingPercent)}%`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('로그인')}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <Image source={require('./assets/images/next.png')} style={styles.appNameImage} />

          {activeTab === '홈' && (
            <>
              <View style={styles.sectionIncome}>
                <Text style={styles.title}>소득 관리</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <Text style={styles.text}>은행 계좌 연결</Text>
                  <Switch value={useBankConnection} onValueChange={setUseBankConnection} />
                </View>
                {useBankConnection ? (
                  <Text style={styles.text}>계좌 연결을 통해 자동으로 수입 정보를 확인합니다.</Text>
                ) : (
                  <TouchableOpacity onPress={() => setIsDialOpen(true)}>
                    <Text style={styles.text}>{formattedIncome || "직접 수입을 입력하세요"}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <SpendingPlanner />

              <View style={styles.sectionPolicy}>
                <Text style={styles.title}>정책 추천</Text>
                <ScrollView>
                  <Text style={styles.text}>{recommendPolicy}</Text>
                </ScrollView>
              </View>
            </>
          )}

          {activeTab === '정책추천' && (
            <View style={styles.tabContent}>
              <Text style={styles.title}>정책추천</Text>
              <SpendingPlanner />
            </View>
          )}

          {activeTab === '설정' && (
            <View style={styles.tabContent}>
              <Text style={styles.title}>설정</Text>
              <View style={styles.myPageBox}>
                <Text style={styles.myPageTitle}>마이페이지</Text>
                <Text style={styles.text}>이름: 홍길동</Text>
                <Text style={styles.text}>이메일: user@example.com</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={() => alert('로그아웃되었습니다.')}>
                  <Text style={styles.logoutButtonText}>로그아웃</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 수입 입력 모달 */}
      {isDialOpen && (
        <Modal visible={isDialOpen} transparent={true} animationType="fade" onRequestClose={() => setIsDialOpen(false)}>
          <View style={styles.dialBackground}>
            <View style={styles.dialContent}>
              <TextInput
                style={styles.dialInput}
                keyboardType="numeric"
                value={income}
                onChangeText={(text) => setIncome(text.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="만원 단위"
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveIncome}>
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 지출 입력 모달 */}
      <Modal visible={isSpendingModalVisible} transparent={true} animationType="fade" onRequestClose={() => setSpendingModalVisible(false)}>
        <View style={styles.dialBackground}>
          <View style={styles.dialContent}>
            <TextInput
              style={styles.dialInput}
              keyboardType="numeric"
              value={inputSpending}
              onChangeText={setInputSpending}
              placeholder="지출 금액 입력 (원)"
            />
            <TouchableOpacity style={styles.saveButton} onPress={addSpending}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 하단 탭 바 */}
      <View style={styles.tabBar}>
        {['홈', '정책추천', '설정'].map((tab, idx) => (
          <React.Fragment key={tab}>
            <TouchableOpacity style={[styles.tabItem, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
              <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
            </TouchableOpacity>
            {idx < 2 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#E9F3E0' },
  container: { flex: 1, padding: 20, backgroundColor: '#E9F3E0' },
  appNameImage: { width: 150, height: 70, resizeMode: 'contain', alignSelf: 'flex-start', marginBottom: 30 },
  loginButton: { position: 'absolute', top: 40, right: 20, zIndex: 10, padding: 8, backgroundColor: '#E9F3E0', borderRadius: 10 },
  loginText: { color: 'black', fontSize: 15 },
  sectionIncome: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 20 },
  sectionPolicy: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 20, height: 200 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  text: { fontSize: 18, marginTop: 10, color: '#666' },
  progressBar: { height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  progressText: { color: 'white', fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#E9F3E0', borderTopWidth: 1, borderTopColor: 'black', height: windowHeight * 0.08 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  tabText: { color: 'black', fontSize: 16 },
  activeTab: { backgroundColor: '#c1bcbc' },
  activeTabText: { color: 'black', fontSize: 20 },
  separator: { width: 1, height: '100%', backgroundColor: 'black' },
  dialBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  dialContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  dialInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingLeft: 10, fontSize: 18, marginBottom: 20 },
  saveButton: { backgroundColor: '#007bff', paddingVertical: 10, borderRadius: 5 },
  saveButtonText: { color: 'white', textAlign: 'center', fontSize: 18 },
  tabContent: { marginBottom: 20 },
  myPageBox: { marginTop: 20, backgroundColor: '#fff', padding: 16, borderRadius: 10 },
  myPageTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  logoutButton: { marginTop: 10, backgroundColor: '#f00', padding: 10, borderRadius: 5 },
  logoutButtonText: { color: '#fff', textAlign: 'center' },
  spendingPlannerBox: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20, minHeight: 300 },
});
