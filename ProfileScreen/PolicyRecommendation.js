import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function AIPolicyScreen() {
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [result, setResult] = useState('');

  const recommendPolicy = () => {
    if (age && job) {
      if (parseInt(age) < 30 && job === '학생') {
        setResult({ 
          type: 'success', 
          text: '청년 대상 「꿈꾸는 장학금」 지원 가능\n- 지원금액: 월 50만원(최대 24개월)\n- 신청기간: ~2025.12.31' 
        });
      } else {
        setResult({ 
          type: 'info', 
          text: '「지역맞춤 일자리」 창업지원금 추천\n- 최대 3천만원 지원\n- 5년 거치 후 5년 분할 상환' 
        });
      }
    } else {
      setResult({ type: 'error', text: '모든 정보를 입력해주세요' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>AI 맞춤 정책 찾기</Text>
        <Text style={styles.subtitle}>간단한 정보 입력으로 최적의 복지정책을 추천해드려요</Text>
      </View>

      {/* 입력 섹션 */}
      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>나이</Text>
          <TextInput
            style={styles.input}
            placeholder="만 나이를 입력"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#95a5a6"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>직업현황</Text>
          <TextInput
            style={styles.input}
            placeholder="예) 학생, 직장인, 프리랜서"
            value={job}
            onChangeText={setJob}
            placeholderTextColor="#95a5a6"
          />
        </View>
      </View>

      {/* 분석 버튼 */}
      <TouchableOpacity 
        style={styles.analyzeButton} 
        onPress={recommendPolicy}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>지금 바로 분석하기</Text>
      </TouchableOpacity>

      {/* 결과 표시 */}
      {result.text && (
        <View style={[styles.resultCard, styles[result.type]]}>
          <Text style={styles.resultIcon}>
            {result.type === 'success' ? '✅' : result.type === 'error' ? '⚠️' : 'ℹ️'}
          </Text>
          <Text style={styles.resultText}>{result.text}</Text>
        </View>
      )}

      {/* 인기 정책 섹션 */}
      <Text style={styles.sectionTitle}>🔥 인기 정책 모아보기</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>청년내일저축계좌</Text>
          <Text style={styles.policyDesc}>월 70만원 적립 시 최대 1,800만원 지원</Text>
          <Text style={styles.policyTag}>#24~34세 #소득하위80%</Text>
        </View>
        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>주거안정자금</Text>
          <Text style={styles.policyDesc}>전세자금 대출 이자 1%p 감면</Text>
          <Text style={styles.policyTag}>#무주택자 #신혼부부</Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f9fc',
    paddingBottom: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fcfcfc',
  },
  analyzeButton: {
    backgroundColor: '#2980b9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  success: {
    backgroundColor: '#e8f6ef',
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  error: {
    backgroundColor: '#fdedee',
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
  },
  info: {
    backgroundColor: '#e8f4fc',
    borderLeftWidth: 5,
    borderLeftColor: '#2980b9',
  },
  resultIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 280,
    marginRight: 16,
    elevation: 2,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2980b9',
    marginBottom: 8,
  },
  policyDesc: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 12,
    lineHeight: 20,
  },
  policyTag: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});

