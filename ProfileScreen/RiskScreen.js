import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';

export default function RiskGraphScreen() {
  const [riskInput, setRiskInput] = useState('');
  const riskValue =
    riskInput === '' ? null : Math.min(100, Math.max(0, parseInt(riskInput) || 0));

  // 게이지 구간 및 색상 정의
  const getLevel = (v) => {
    if (v === null) return null;
    if (v <= 30) return { label: 'LOW', color: '#7CFC00' };
    if (v <= 70) return { label: 'MEDIUM', color: '#FFA500' };
    return { label: 'HIGH', color: '#FF0000' };
  };
  const levelInfo = getLevel(riskValue);

  let message = '';
  let policies = [];
  let messageColor = '#2c3e50';

  if (riskValue === null) {
    message = '당신의 위험도는 얼마인가요?';
    policies = [];
    messageColor = '#2c3e50';
  } else if (riskValue <= 30) {
    message = '잘 하고 있습니다! 당신에게 필요한 복지정책 Top3';
    policies = [
      '청년 내일채움공제',
      '주거급여 지원',
      '문화누리카드'
    ];
    messageColor = '#2980ef';
  } else if (riskValue <= 70) {
    message = '보통입니다! 필요한 복지정책 Top3';
    policies = [
      '긴급복지지원제도',
      '근로장려금',
      '국민취업지원제도'
    ];
    messageColor = '#f1c40f';
  } else {
    message = '위험합니다! 꼭 확인하세요! 복지정책 Top3';
    policies = [
      '기초생활보장제도',
      '긴급생계비 지원',
      '신용회복지원'
    ];
    messageColor = '#e74c3c';
  }

  // labels 배열에 고유한 name 값 추가 (빈 문자열 제거)
  const labels = [
    { name: 'low-label', labelColor: '#7CFC00', activeBarColor: '#7CFC00' },
    { name: 'medium-label', labelColor: '#FFA500', activeBarColor: '#FFA500' },
    { name: 'high-label', labelColor: '#FF0000', activeBarColor: '#FF0000' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 금융 위험도 분석</Text>
      <View style={{ height: 24 }} />
      <TextInput
        style={styles.input}
        placeholder="위험도 입력 (0-100)"
        keyboardType="numeric"
        value={riskInput}
        onChangeText={text => setRiskInput(text.replace(/[^0-9]/g, ''))}
        maxLength={3}
      />
      <View style={{ height: 24 }} />

      {riskValue === null ? (
        <View style={styles.questionBox}>
          <Text style={styles.questionMark}>❓</Text>
          <Text style={styles.askText}>{message}</Text>
        </View>
      ) : (
        <>
          <View style={styles.gaugeContainer}>
            <RNSpeedometer
              value={riskValue}
              size={240}
              minValue={0}
              maxValue={100}
              allowedDecimals={0}
              labels={labels}
              easeDuration={500}
              labelNoteStyle={{ display: 'none' }}
              needleColor="#222"
              currentValueTextColor="black"
            />
            {levelInfo && (
              <Text style={[styles.levelText, { color: levelInfo.color }]}>
                {levelInfo.label}
              </Text>
            )}
          </View>
          <View style={{ height: 24 }} />
          <Text style={[styles.message, { color: messageColor }]}>
            {message}
          </Text>
          <View style={{ height: 24 }} />
          {Array.isArray(policies) && policies.length > 0 && (
            <View style={styles.policyBox}>
              {policies.map((policy, idx) => (
                <Text key={`policy-${idx}`} style={styles.policyText}>
                  {`${idx + 1}. ${policy}`}
                </Text>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center', // 화면 전체를 세로 중앙 정렬
  },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: '#2c3e50' },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  levelText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginTop: 0,
  },
  policyText: {
    fontSize: 17,
    marginVertical: 4,
    color: '#34495e',
  },
  questionBox: {
    alignItems: 'center',
    marginVertical: 40,
  },
  questionMark: {
    fontSize: 60,
    color: '#b2bec3',
    marginBottom: 10,
  },
  askText: {
    fontSize: 20,
    color: '#636e72',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
