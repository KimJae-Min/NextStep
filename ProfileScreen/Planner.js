import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// 임시 최근 7일 지출 데이터 (단위: 만원)
const spendingData = [15, 22, 18, 25, 30, 45, 38];
const spendingLabels = ['월', '화', '수', '목', '금', '토', '일'];

export default function Planner() {
  const navigation = useNavigation();
  const route = useRoute();
  const profileData = route.params?.profileData || {};

  // 위험도 계산 함수
  const calculateRisk = () => {
    const income = parseInt(profileData.income) || 1;
    const fixed = parseInt(profileData.fixedExpense) || 0;
    const habit = profileData.spendingHabit || '보통';
    const fixedRatio = Math.min((fixed / income) * 100, 70);
    const habitWeight = { '낮음': 10, '보통': 30, '높음': 50 }[habit] || 30;
    return Math.min(fixedRatio + habitWeight, 100);
  };
  const riskValue = calculateRisk();

  // 일평균 지출 및 위험 기준
  const avgSpending = spendingData.reduce((a, b) => a + b, 0) / spendingData.length;
  const spendingDanger = avgSpending > 25; // 25만원 초과면 위험(임의 기준)

  // 위험도 설명
  let riskDesc = '';
  let riskColor = '#2ecc71';
  if (riskValue > 70) {
    riskDesc = '위험: 지출이 매우 높아요!';
    riskColor = '#e74c3c';
  } else if (riskValue > 40) {
    riskDesc = '주의: 지출이 다소 많아요.';
    riskColor = '#f1c40f';
  } else {
    riskDesc = '안정: 지출이 적정 수준입니다.';
    riskColor = '#2ecc71';
  }

  return (
    <View style={styles.outer}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>지출 플래너</Text>

        {/* 주간 지출 추이 그래프 */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>📊 주간 지출 추이</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: spendingLabels,
                datasets: [{ data: spendingData }],
              }}
              width={windowWidth - 64} // 좌우 패딩, 카드 여백 고려 (그래프가 카드 안에 정확히 들어가게)
              height={180}
              yAxisSuffix="만"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => spendingDanger ? `rgba(231,76,60,${opacity})` : `rgba(41,128,185,${opacity})`,
                labelColor: () => '#7f8c8d',
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: spendingDanger ? '#e74c3c' : '#2980b9',
                },
              }}
              bezier
              style={{ borderRadius: 12 }}
              withInnerLines={false}
              withOuterLines={false}
              fromZero
            />
          </View>
          <Text style={[
            styles.avgText,
            { color: spendingDanger ? '#e74c3c' : '#2980b9' }
          ]}>
            최근 일평균 지출: {avgSpending.toLocaleString()}만원
            {spendingDanger ? ' (위험: 지출이 많아요!)' : ' (안정)'}
          </Text>
        </View>

        {/* 일일/월간 지출 현황을 한 줄에 */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={styles.summaryLabel}>일일 지출</Text>
            <Text style={styles.summaryValue}>150,000원</Text>
            <Text style={styles.summaryComment}>어제 대비 +12%</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📅</Text>
            <Text style={styles.summaryLabel}>월간 지출</Text>
            <Text style={styles.summaryValue}>4,500,000원</Text>
            <Text style={styles.summaryComment}>예산 대비 23% 초과</Text>
          </View>
        </View>

        {/* 위험도 분석 카드 (터치 시 바로 이동) */}
        <TouchableOpacity
          style={[styles.sectionCard, styles.riskCard]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Risk', { riskValue })}
        >
          <Text style={styles.sectionTitle}>🛡️ 지출 위험도 분석</Text>
          {/* 위험도 게이지 */}
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeBackground}>
              <View
                style={[
                  styles.gaugeFill,
                  { width: `${riskValue}%`, backgroundColor: riskColor },
                ]}
              />
            </View>
            <Text style={[styles.gaugeText, { color: riskColor }]}>
              현재 위험도: {riskValue}%
            </Text>
            <Text style={[styles.riskDesc, { color: riskColor }]}>
              {riskDesc}
            </Text>
          </View>
          <Text style={styles.clickGuideText}>터치하면 상세 분석 화면으로 이동</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#e8f0e1',
  },
  container: {
    padding: 16,
    paddingBottom: 36,
    minHeight: windowHeight - 80,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#215b36',
    textAlign: 'center',
    letterSpacing: 1,
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  avgText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    marginHorizontal: 4,
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2980b9',
    marginBottom: 4,
  },
  summaryComment: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    alignItems: 'center',
  },
  riskCard: {
    borderWidth: 2,
    borderColor: '#b6e2c7',
    backgroundColor: '#f6fff7',
  },
  gaugeContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  gaugeBackground: {
    width: '100%',
    height: 22,
    backgroundColor: '#ecf0f1',
    borderRadius: 11,
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 11,
  },
  gaugeText: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '600',
  },
  riskDesc: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: 'bold',
  },
  clickGuideText: {
    color: '#888',
    marginTop: 14,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});
