import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

export default function Page() {
  const navigation = useNavigation();
  const [spending] = useState(50); // 지출 퍼센트
  const [income, setIncome] = useState('');
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('홈');

  const recommendPolicy = income > 2500 ? '주거 지원 정책 추천' : '일반 지원 정책 추천';
  const formattedIncome = income ? `${income}만원` : '';

  const getRiskColor = () => {
    if (spending > 80) return 'red';
    if (spending > 30) return 'orange';
    return 'green';
  };

  const saveIncome = () => {
    if (income !== '') {
      setIsDialOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('로그인')}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* 앱 이름 이미지 */}
      <Image source={require('./assets/images/next.png')} style={styles.appNameImage} />

      {/* 탭 콘텐츠 */}
      {activeTab === '홈' && (
        <>
          <View style={styles.sectionIncome}>
            <Text style={styles.title}>소득 정보(월수입)</Text>
            <TouchableOpacity onPress={() => setIsDialOpen(true)}>
              <Text style={styles.text}>{formattedIncome || "소득을 입력하세요"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionPolicy}>
            <Text style={styles.title}>정책 추천</Text>
            <ScrollView>
              <Text style={styles.text}>{recommendPolicy}</Text>
            </ScrollView>
          </View>

          <View style={styles.sectionRisk}>
            <Text style={styles.title}>지출 위험도</Text>
            <TouchableOpacity onPress={() => navigation.navigate('지출위험도설명')} activeOpacity={0.8}>
              <View style={[styles.progressBar, { backgroundColor: getRiskColor(), width: `${spending}%` }]}>
                <Text style={styles.progressText}>{`지출 퍼센트: ${spending}%`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}

      {activeTab === '마이페이지' && (
        <View style={styles.tabContent}>
          <Text style={styles.title}>마이페이지</Text>
        </View>
      )}

      {activeTab === '정책추천' && (
        <View style={styles.tabContent}>
          <Text style={styles.title}>정책추천</Text>
        </View>
      )}

      {activeTab === '설정' && (
        <View style={styles.tabContent}>
          <Text style={styles.title}>설정</Text>
        </View>
      )}

      {/* 다이얼러 모달 */}
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

      {/* 하단 탭 바 */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, activeTab === '홈' && styles.activeTab]} onPress={() => setActiveTab('홈')}>
          <Text style={activeTab === '홈' ? styles.activeTabText : styles.tabText}>홈</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={[styles.tabItem, activeTab === '마이페이지' && styles.activeTab]} onPress={() => setActiveTab('마이페이지')}>
          <Text style={activeTab === '마이페이지' ? styles.activeTabText : styles.tabText}>마이페이지</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={[styles.tabItem, activeTab === '정책추천' && styles.activeTab]} onPress={() => setActiveTab('정책추천')}>
          <Text style={activeTab === '정책추천' ? styles.activeTabText : styles.tabText}>정책추천</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={[styles.tabItem, activeTab === '설정' && styles.activeTab]} onPress={() => setActiveTab('설정')}>
          <Text style={activeTab === '설정' ? styles.activeTabText : styles.tabText}>설정</Text>
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
    height: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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






















