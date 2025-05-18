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

  const recommendPolicy = income > 2500 ? '주거 지원 정책 추천' : '일반 지원 정책 추천';
  const formattedIncome = income ? `${income}만원` : '';

  const saveIncome = () => {
    if (income !== '') {
      setIsDialOpen(false);
    }
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
      <View style={styles.tabContent}>
        {activeTab === '홈' && (
          <>
            {/* 소득 정보(월수입) */}
            <TouchableOpacity
              style={styles.sectionIncome}
              onPress={() => setIsDialOpen(true)}
            >
              <Text style={styles.title}>소득 정보</Text>
              <Text style={styles.text}>{formattedIncome || '소득을 입력하세요'}</Text>
            </TouchableOpacity>

            {/* 정책 추천 */}
            <TouchableOpacity
              style={styles.sectionPolicy}
              onPress={() => navigation.navigate('PolicyRecommendation')}
            >
              <Text style={styles.title}>정책 추천</Text>
              <Text style={styles.text}>{recommendPolicy}</Text>
            </TouchableOpacity>

            {/* 지출 위험도 */}
            <TouchableOpacity
              style={styles.sectionRisk}
              onPress={() => navigation.navigate('Planner', { profileData })}
            >
              <Text style={styles.title}>지출 위험도</Text>
              <Text style={styles.text}>{`지출 퍼센트: ${spending}%`}</Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === '마이페이지' && (
          <Text>마이페이지로 이동합니다...</Text>
        )}
        {activeTab === '정책추천' && (
          <Text>정책추천 화면</Text>
        )}
        {activeTab === '설정' && (
          <Text>설정 화면</Text>
        )}
      </View>

      {/* 다이얼러 모달 */}
      <Modal
        visible={isDialOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDialOpen(false)}
      >
        <View style={styles.dialBackground}>
          <View style={styles.dialContent}>
            <Text style={styles.title}>월 소득 입력</Text>
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
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.tabItem, activeTab === '마이페이지' && styles.activeTab]}
          onPress={() => onTabPress('마이페이지')}
        >
          <Text style={[styles.tabText, activeTab === '마이페이지' && styles.activeTabText]}>마이페이지</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.tabItem, activeTab === '정책추천' && styles.activeTab]}
          onPress={() => onTabPress('정책추천')}
        >
          <Text style={[styles.tabText, activeTab === '정책추천' && styles.activeTabText]}>정책추천</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
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
  appNameImage: {
    width: 150,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginBottom: 30,
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
  progressBar: {
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
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
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: 'black',
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
  tabContent: {
    marginBottom: 20,
  },
});
