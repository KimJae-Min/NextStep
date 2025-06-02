import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useThemeMode } from './ThemeContext';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // 아이콘 라이브러리 사용 시

export default function SettingsScreen({ navigation }) {
  const { darkMode, toggleDarkMode } = useThemeMode();

  // 스타일
  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const cardStyle = [styles.card, darkMode && styles.cardDark];
  const cardHeaderStyle = styles.cardHeader;
  const cardIconStyle = styles.cardIcon;
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const labelStyle = [styles.label, darkMode && { color: '#bbb' }];
  const sectionTitleStyle = [styles.sectionTitle, darkMode && { color: '#fff' }];
  const buttonStyle = [styles.button, darkMode && { backgroundColor: '#444' }];
  const buttonTextStyle = [styles.buttonText, darkMode && { color: '#fff' }];

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={titleStyle}>설정</Text>

        {/* 다크모드 토글 카드 */}
        <View style={cardStyle}>
          <View style={cardHeaderStyle}>
            {/* <Icon name="weather-night" size={22} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
            <Text style={cardIconStyle}>🌙</Text>
            <Text style={sectionTitleStyle}>다크모드</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={labelStyle}>{darkMode ? '다크모드 사용 중' : '라이트모드 사용 중'}</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              thumbColor={darkMode ? '#70d7c7' : '#eee'}
              trackColor={{ false: '#bbb', true: '#23262F' }}
            />
          </View>
        </View>

        {/* 계정 관리 카드 */}
        <View style={cardStyle}>
          <View style={cardHeaderStyle}>
            {/* <Icon name="account-circle" size={22} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
            <Text style={cardIconStyle}>👤</Text>
            <Text style={sectionTitleStyle}>계정 관리</Text>
          </View>
          <TouchableOpacity
            style={buttonStyle}
            onPress={() => navigation.navigate('MyPage')}
            activeOpacity={0.8}
          >
            <Text style={buttonTextStyle}>내 정보 수정</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 설정 카드 */}
        <View style={cardStyle}>
          <View style={cardHeaderStyle}>
            {/* <Icon name="bell-ring" size={22} color={darkMode ? "#70d7c7" : "#2980b9"} /> */}
            <Text style={cardIconStyle}>🔔</Text>
            <Text style={sectionTitleStyle}>알림 설정</Text>
          </View>
          <Text style={labelStyle}>앱 푸시, 정책 알림 등</Text>
        </View>

        {/* 로그아웃/탈퇴 */}
        <View style={cardStyle}>
          <TouchableOpacity
            style={buttonStyle}
            onPress={() => {
              // 로그아웃 로직 추가
              navigation.navigate('Login');
            }}
            activeOpacity={0.8}
          >
            <Text style={buttonTextStyle}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[buttonStyle, { marginTop: 10, backgroundColor: darkMode ? '#222' : '#eee' }]}
            onPress={() => {
              // 탈퇴 로직 추가
            }}
            activeOpacity={0.8}
          >
            <Text style={[buttonTextStyle, { color: darkMode ? '#ff7675' : '#e74c3c' }]}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 56 : 30,
    paddingHorizontal: 16,
    backgroundColor: '#F4F7FA',
  },
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
    marginRight: 7,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#215b36',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginVertical: 8,
    marginLeft: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#2980b9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
