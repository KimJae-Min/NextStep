import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useThemeMode } from './ThemeContext';

export default function RiskGraphScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { darkMode } = useThemeMode();

  const riskValue = route.params?.riskValue ?? null;

  const getLevel = (v) => {
    if (v === null) return null;
    if (v <= 30) return { label: '낮음', color: darkMode ? '#70d7c7' : '#7CFC00' };
    if (v <= 70) return { label: '보통', color: darkMode ? '#f1c40f' : '#FFA500' };
    return { label: '높음', color: darkMode ? '#ff7675' : '#FF0000' };
  };

  const levelInfo = getLevel(riskValue);

  let message = '';
  let policies = [];
  let messageColor = darkMode ? '#70d7c7' : '#2c3e50';

  if (riskValue === null) {
    message = '위험도 정보가 없습니다.';
    policies = [];
    messageColor = darkMode ? '#bbb' : '#2c3e50';
  } else if (riskValue <= 30) {
    message = '잘 하고 있습니다! 당신에게 필요한 복지정책 Top3';
    policies = ['청년 내일채움공제', '주거급여 지원', '문화누리카드'];
    messageColor = darkMode ? '#70d7c7' : '#2980ef';
  } else if (riskValue <= 70) {
    message = '보통입니다! 필요한 복지정책 Top3';
    policies = ['긴급복지지원제도', '근로장려금', '국민취업지원제도'];
    messageColor = darkMode ? '#f1c40f' : '#f1c40f';
  } else {
    message = '위험합니다! 꼭 확인하세요! 복지정책 Top3';
    policies = ['기초생활보장제도', '긴급생계비 지원', '신용회복지원'];
    messageColor = darkMode ? '#ff7675' : '#e74c3c';
  }

  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const gaugeContainerStyle = [styles.gaugeContainer];
  const messageStyle = [styles.message, { color: messageColor }, darkMode && { color: messageColor }];
  const policyBoxStyle = [styles.policyBox, darkMode && { backgroundColor: '#23262F' }];
  const policyTextStyle = [styles.policyText, darkMode && { color: '#bbb' }];
  const moreButtonStyle = [styles.moreButton, darkMode && { backgroundColor: '#444' }];
  const moreButtonTextStyle = [styles.moreButtonText, darkMode && { color: '#fff' }];

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>💰 금융 위험도 분석</Text>
      <View style={gaugeContainerStyle}>
        <RNSpeedometer
          value={riskValue || 0}
          minValue={0}
          maxValue={100}
          size={220}
          labels={[
            { name: '낮음', labelColor: darkMode ? '#70d7c7' : '#7CFC00', activeBarColor: darkMode ? '#70d7c7' : '#7CFC00' },
            { name: '보통', labelColor: darkMode ? '#f1c40f' : '#FFA500', activeBarColor: darkMode ? '#f1c40f' : '#FFA500' },
            { name: '높음', labelColor: darkMode ? '#ff7675' : '#FF0000', activeBarColor: darkMode ? '#ff7675' : '#FF0000' },
          ]}
          valueTextStyle={{
            color: darkMode ? '#fff' : '#222',
            fontSize: 32,
            fontWeight: 'bold',
          }}
          labelStyle={{
            color: 'transparent',
          }}
          // needleImage={null} // << 이 줄을 반드시 제거!
          currentValueTextColor={darkMode ? '#fff' : '#222'}
        />
        {levelInfo && (
          <Text style={[{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }, { color: levelInfo.color }]}>
            {`현재 위험도: ${riskValue}% (${levelInfo.label})`}
          </Text>
        )}
      </View>
      <Text style={messageStyle}>{message}</Text>
      {Array.isArray(policies) && policies.length > 0 && (
        <View style={policyBoxStyle}>
          {policies.map((policy, idx) => (
            <Text key={policy} style={policyTextStyle}>
              {`${idx + 1}. ${policy}`}
            </Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={moreButtonStyle}
        onPress={() => navigation.navigate('PolicyRecommendation')}
        activeOpacity={0.8}
      >
        <Text style={moreButtonTextStyle}>복지정책 더보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 18,
  },
  policyBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 16,
    marginTop: 16,
  },
  policyText: {
    fontSize: 17,
    marginVertical: 4,
    color: '#34495e',
  },
  moreButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#2980b9',
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    elevation: 2,
  },
  moreButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
