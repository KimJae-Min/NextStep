import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Animated,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeMode } from './ThemeContext';
import { useUser } from './UserContext';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // 아이콘 라이브러리 사용 시

const windowHeight = Dimensions.get('window').height;

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();
  const { darkMode } = useThemeMode();
  const { user, logout } = useUser();

  // 프로필 데이터에서 소득과 고정지출 추출
  // route.params에서 가져오거나 없으면 사용자 프로필에서 가져오기
  const routeProfileData = route.params?.profileData;
  const userProfileData = user?.profileData || {};
  
  // route.params가 있으면 그것을 우선적으로 사용하고, 없으면 저장된 사용자 프로필 데이터 사용
  const profileData = routeProfileData || userProfileData;
  
  const income = Number(profileData.income) || 0;
  const fixedExpense = Number(profileData.fixedExpense) || 0;
  const spendingPercent = income > 0 ? Math.round((fixedExpense / income) * 100) : 0;

  const [incomeInput, setIncomeInput] = useState('');
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('홈');
  const [bankConnected, setBankConnected] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(500000);

  // 카드 애니메이션
  const cardAnim = useState(new Animated.Value(0))[0];
  React.useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const recommendPolicy = income > 2500 ? '주거 지원 정책 추천' : '일반 지원 정책 추천';
  const formattedIncome = income ? `${income}만원` : '';

  const saveIncome = () => {
    if (incomeInput !== '') setIsDialOpen(false);
  };

  const onTabPress = (tabName) => {
    setActiveTab(tabName);
    if (tabName === '마이페이지') navigation.navigate('MyPage', { profileData });
    if (tabName === '정책추천') navigation.navigate('PolicyRecommendation');
    if (tabName === '설정') navigation.navigate('Settings');
  };

  const handleBankConnect = () => setBankConnected(true);
  const handleLedgerRegister = () => navigation.navigate('Ledger');

  // 스타일
  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const cardStyle = [styles.card, darkMode && styles.cardDark];
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const textStyle = [styles.text, darkMode && { color: '#bbb' }];
  const logoutTextStyle = [styles.logoutText, darkMode && { color: '#fff' }];
  const assetSummaryStyle = [styles.assetSummary, darkMode && styles.assetSummaryDark];
  const assetTitleStyle = [styles.assetTitle, darkMode && { color: '#bbb' }];
  const assetAmountStyle = [styles.assetAmount, darkMode && { color: '#70d7c7' }];
  const connectButtonStyle = (active) => [
    styles.connectButton,
    active && styles.activeConnectButton,
    darkMode && { backgroundColor: active ? '#009688' : '#23262F', borderColor: '#333' },
  ];
  const connectButtonTextStyle = [styles.connectButtonText, darkMode && { color: '#fff' }];
  const tabBarStyle = [styles.tabBar, darkMode && { backgroundColor: '#23262F', borderTopColor: '#444' }];
  const tabTextStyle = (tab) => [
    styles.tabText,
    activeTab === tab && styles.activeTabText,
    darkMode && { color: activeTab === tab ? '#70d7c7' : '#bbb' },
  ];
  const dialContentStyle = [styles.dialContent, darkMode && { backgroundColor: '#23262F' }];
  const dialInputStyle = [
    styles.dialInput,
    darkMode && { backgroundColor: '#181A20', color: '#fff', borderColor: '#555' },
  ];
  const saveButtonTextStyle = [styles.saveButtonText, darkMode && { color: '#fff' }];

  // 카드 애니메이션 스타일
  const animatedCard = {
    opacity: cardAnim,
    transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
  };

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && { backgroundColor: '#181A20' }]}>
      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => {
        logout();
        Alert.alert('알림', '로그아웃 되었습니다.');
        navigation.navigate('Login');
      }}>
        <Text style={logoutTextStyle}>로그아웃</Text>
      </TouchableOpacity>

      {/* 메인 콘텐츠 */}
      <View style={containerStyle}>
        {activeTab === '홈' && (
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {/* 소득 정보(월수입) */}
            <Animated.View style={[cardStyle, animatedCard, { marginTop: 25 }]}>
              <View style={styles.cardHeader}>
                {/* <Icon name="wallet" size={22} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
                <Text style={styles.cardIcon}>💸</Text>
                <Text style={titleStyle}>소득 정보</Text>
              </View>
              <TouchableOpacity onPress={() => setIsDialOpen(true)}>
                <Text style={textStyle}>{formattedIncome || '소득을 입력하세요'}</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* 자산 요약 */}
            <Animated.View style={[assetSummaryStyle, animatedCard]}>
              <Text style={assetTitleStyle}>현재 금액(순자산)</Text>
              <Text style={assetAmountStyle}>{currentAmount.toLocaleString()}원</Text>
            </Animated.View>

            {/* 버튼 컨테이너 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={connectButtonStyle(bankConnected)}
                onPress={handleBankConnect}
                activeOpacity={0.85}
              >
                {/* <Icon name="bank" size={18} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
                <Text style={styles.buttonIcon}>🏦</Text>
                <Text style={connectButtonTextStyle}>
                  {bankConnected ? '은행 계좌 연결됨' : '은행 계좌 연결'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={connectButtonStyle(false)}
                onPress={handleLedgerRegister}
                activeOpacity={0.85}
              >
                {/* <Icon name="notebook" size={18} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
                <Text style={styles.buttonIcon}>📒</Text>
                <Text style={connectButtonTextStyle}>가계부 등록</Text>
              </TouchableOpacity>
            </View>

            {/* 정책 추천 */}
            <Animated.View style={[cardStyle, animatedCard]}>
              <View style={styles.cardHeader}>
                {/* <Icon name="account-group" size={22} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
                <Text style={styles.cardIcon}>🏡</Text>
                <Text style={titleStyle}>정책 추천</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('PolicyRecommendation')}>
                <Text style={textStyle}>{recommendPolicy}</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* 지출 위험도(플래너) */}
            <Animated.View style={[cardStyle, animatedCard]}>
              <View style={styles.cardHeader}>
                {/* <Icon name="shield-alert" size={22} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
                <Text style={styles.cardIcon}>🛡️</Text>
                <Text style={titleStyle}>지출 위험도</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Planner', { profileData })}>
                <Text style={textStyle}>{`지출 퍼센트: ${spendingPercent}%`}</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.ScrollView>
        )}

        {/* 소득 입력 모달 */}
        <Modal visible={isDialOpen} transparent animationType="fade">
          <View style={styles.dialBackground}>
            <View style={dialContentStyle}>
              <Text style={titleStyle}>월 소득 입력</Text>
              <TextInput
                style={dialInputStyle}
                value={incomeInput}
                onChangeText={(text) => setIncomeInput(text.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="만원 단위"
                keyboardType="numeric"
                placeholderTextColor={darkMode ? "#bbb" : "#888"}
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveIncome}>
                <Text style={saveButtonTextStyle}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* 하단 탭 바 */}
      <View style={tabBarStyle}>
        {['홈', '정책추천', '설정'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.8}
          >
            <Text style={tabTextStyle(tab)}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F4F7FA',
    marginBottom: 80,
  },
  logoutButton: {
    marginTop: 15,
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  logoutText: { color: '#e74c3c', fontSize: 15, fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardDark: {
    backgroundColor: '#23262F',
    shadowColor: '#000',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  text: {
    fontSize: 17,
    color: '#555',
    marginTop: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 0,
  },
  assetSummary: {
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
  },
  assetSummaryDark: {
    backgroundColor: '#181A20',
    borderColor: '#23262F',
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 2,
  },
  assetAmount: {
    fontSize: 25,
    color: '#2980b9',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 10,
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F7',
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9f2ee',
    justifyContent: 'center',
    marginHorizontal: 2,
    marginBottom: 4,
    gap: 4,
  },
  activeConnectButton: {
    backgroundColor: '#70d7c7',
    borderColor: '#70d7c7',
  },
  connectButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F4F7FA',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: windowHeight * 0.08,
    paddingBottom: Platform.OS === 'ios' ? 14 : 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#2980b9',
    fontSize: 17,
    fontWeight: 'bold',
  },
  dialBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  dialInput: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 20,
    color: '#222',
    backgroundColor: '#fff',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    borderRadius: 6,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
