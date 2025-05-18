import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function RiskGraphScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  // Planner에서 전달된 riskValue 사용
  const riskValue = route.params?.riskValue ?? null;

  // 한글만 나오는 레이블 및 색상
  const getLevel = (v) => {
    if (v === null) return null;
    if (v <= 30) return { label: '낮음', color: '#7CFC00' };
    if (v <= 70) return { label: '보통', color: '#FFA500' };
    return { label: '높음', color: '#FF0000' };
  };

  const levelInfo = getLevel(riskValue);

  let message = '';
  let policies = [];
  let messageColor = '#2c3e50';

  if (riskValue === null) {
    message = '위험도 정보가 없습니다.';
    policies = [];
    messageColor = '#2c3e50';
  } else if (riskValue <= 30) {
    message = '잘 하고 있습니다! 당신에게 필요한 복지정책 Top3';
    policies = ['청년 내일채움공제', '주거급여 지원', '문화누리카드'];
    messageColor = '#2980ef';
  } else if (riskValue <= 70) {
    message = '보통입니다! 필요한 복지정책 Top3';
    policies = ['긴급복지지원제도', '근로장려금', '국민취업지원제도'];
    messageColor = '#f1c40f';
  } else {
    message = '위험합니다! 꼭 확인하세요! 복지정책 Top3';
    policies = ['기초생활보장제도', '긴급생계비 지원', '신용회복지원'];
    messageColor = '#e74c3c';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 금융 위험도 분석</Text>
      <View style={styles.gaugeContainer}>
        <RNSpeedometer
          value={riskValue || 0}
          minValue={0}
          maxValue={100}
          size={220}
          labels={[
            { name: '낮음', labelColor: '#7CFC00', activeBarColor: '#7CFC00' },
            { name: '보통', labelColor: '#FFA500', activeBarColor: '#FFA500' },
            { name: '높음', labelColor: '#FF0000', activeBarColor: '#FF0000' },
          ]}
        />
      </View>
      <View style={{ height: 60 }} />
      <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
      {Array.isArray(policies) && policies.length > 0 && (
        <View style={styles.policyBox}>
          {policies.map((policy, idx) => (
            <Text key={idx} style={styles.policyText}>
              {`${idx + 1}. ${policy}`}
            </Text>
          ))}
        </View>
      )}

      {/* 복지정책 더보기 버튼 */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => navigation.navigate('PolicyRecommendation')}
        activeOpacity={0.8}
      >
        <Text style={styles.moreButtonText}>복지정책 더보기</Text>
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
