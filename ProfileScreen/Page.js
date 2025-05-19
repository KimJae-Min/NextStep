//메인화면
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();
  const profileData = route.params?.profileData || {};

  const [spending] = useState(50); // 지출 퍼센트
  const [income, setIncome] = useState('');
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('홈');
  const [bankConnected, setBankConnected] = useState(false);

  // 예시: 현재 금액(순자산)
  const [currentAmount, setCurrentAmount] = useState(500000); // 50만원 예시

  const recommendPolicy = income > 2500 ? '주거 지원 정책 추천' : '일반 지원 정책 추천';
  const formattedIncome = income ? `${income}만원` : '';

  const saveIncome = () => {
    if (income !== '') setIsDialOpen(false);
  };

  // 탭 선택 시 처리 함수
  const onTabPress = (tabName) => {
    setActiveTab(tabName);
    if (tabName === '마이페이지') {
      navigation.navigate('MyPage', { profileData });
    }
    if (tabName === '정책추천') {
      navigation.navigate('PolicyRecommendation');
    }
    if (tabName === '설정') {
      navigation.navigate('Settings');
    }
  };

  // 은행계좌 연결 버튼 클릭 시
  const handleBankConnect = () => {
    setBankConnected(true);
    // 실제 은행 연결 로직 또는 navigation 추가 가능
  };

  // 가계부 등록 버튼 클릭 시 LedgerScreen으로 이동
  const handleLedgerRegister = () => {
    navigation.navigate('Ledger'); // App.js에 Stack.Screen name="Ledger"로 등록 필요
  };

  return (
    <View style={styles.container}>
      {/* 로그인 버튼 */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* 탭 콘텐츠 */}
      {activeTab === '홈' && (
        <>
          {/* 소득 정보(월수입) */}
          <View style={styles.sectionIncome}>
            <Text style={styles.title}>소득 정보</Text>
            <TouchableOpacity onPress={() => setIsDialOpen(true)}>
              <Text style={styles.text}>{formattedIncome || '소득을 입력하세요'}</Text>
            </TouchableOpacity>

            {/* 현재 금액(순자산) */}
            <View style={styles.assetSummary}>
              <Text style={styles.assetTitle}>현재 금액(순자산)</Text>
              <Text style={styles.assetAmount}>
                {currentAmount.toLocaleString()}원
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.connectButton,
                  bankConnected && styles.activeConnectButton,
                ]}
                onPress={handleBankConnect}
              >
                <Text style={styles.connectButtonText}>
                  {bankConnected ? '은행 계좌 연결됨' : '은행 계좌 연결'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleLedgerRegister}
              >
                <Text style={styles.connectButtonText}>가계부 등록</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 정책 추천 */}
          <View style={styles.sectionPolicy}>
            <Text style={styles.title}>정책 추천</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PolicyRecommendation')}>
              <Text style={styles.text}>{recommendPolicy}</Text>
            </TouchableOpacity>
          </View>

          {/* 지출 위험도(플래너) */}
          <View style={styles.sectionRisk}>
            <Text style={styles.title}>지출 위험도</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Planner', { profileData })}>
              <Text style={styles.text}>{`지출 퍼센트: ${spending}%`}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* 다이얼러 모달 */}
      <Modal visible={isDialOpen} transparent animationType="fade">
        <View style={styles.dialBackground}>
          <View style={styles.dialContent}>
            <Text>월 소득 입력</Text>
            <TextInput
              style={styles.dialInput}
              value={income}
              onChangeText={text => setIncome(text.replace(/\D/g, ''))}
              maxLength={6}
              placeholder="만원 단위"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveIncome}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 하단 탭 바 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === '홈' && styles.activeTab]}
          onPress={() => onTabPress('홈')}
        >
          <Text style={[styles.tabText, activeTab === '홈' && styles.activeTabText]}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === '정책추천' && styles.activeTab]}
          onPress={() => onTabPress('정책추천')}
        >
          <Text style={[styles.tabText, activeTab === '정책추천' && styles.activeTabText]}>정책추천</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === '설정' && styles.activeTab]}
          onPress={() => onTabPress('설정')}
        >
          <Text style={[styles.tabText, activeTab === '설정' && styles.activeTabText]}>설정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E9F3E0',
    marginBottom: 80,
  },
  loginButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#E9F3E0',
    borderRadius: 10,
  },
  loginText: {
    color: 'black',
    fontSize: 15,
  },
  sectionIncome: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  assetSummary: {
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  assetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  assetAmount: {
    fontSize: 24,
    color: 'blue',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  connectButton: {
    flex: 1,
    backgroundColor: '#EAF3E1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeConnectButton: {
    backgroundColor: '#70d7c7',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionPolicy: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
  },
  sectionRisk: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E9F3E0',
    position: 'absolute',
    bottom: 0,
    width: '113%',
    borderTopWidth: 1,
    borderTopColor: 'black',
    height: windowHeight * 0.08,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  activeTab: {
    backgroundColor: '#c1bcbc',
  },
  activeTabText: {
    color: 'black',
    fontSize: 20,
  },
  dialBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  dialInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});
