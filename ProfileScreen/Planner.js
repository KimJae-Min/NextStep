import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeMode } from './ThemeContext';

const windowWidth = Dimensions.get('window').width;

const spendingData = [15, 22, 18, 25, 30, 45, 38];
const spendingLabels = ['월', '화', '수', '목', '금', '토', '일'];

export default function Planner() {
  const navigation = useNavigation();
  const route = useRoute();
  const { darkMode } = useThemeMode();
  const profileData = route.params?.profileData || {};

  // 위험도 계산
  const calculateRisk = () => {
    const income = Number(profileData.income) || 0;
    const fixed = Number(profileData.fixedExpense) || 0;
    return income > 0 ? Math.round((fixed / income) * 100) : 0;
  };
  const riskValue = calculateRisk();

  // 일평균 지출 및 위험 기준
  const avgSpending = spendingData.reduce((a, b) => a + b, 0) / spendingData.length;
  const spendingDanger = avgSpending > 25;

  // 위험도 설명
  let riskDesc = '';
  let riskColor = darkMode ? '#70d7c7' : '#2ecc71';
  if (riskValue > 70) {
    riskDesc = '위험: 지출이 매우 높아요!';
    riskColor = darkMode ? '#ff7675' : '#e74c3c';
  } else if (riskValue > 40) {
    riskDesc = '주의: 지출이 다소 많아요.';
    riskColor = darkMode ? '#f1c40f' : '#f1c40f';
  } else {
    riskDesc = '안정: 지출이 적정 수준입니다.';
    riskColor = darkMode ? '#70d7c7' : '#2ecc71';
  }

  // 스타일
  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const cardStyle = [styles.card, darkMode && styles.cardDark];
  const chartCardStyle = [styles.chartCard, darkMode && styles.cardDark];
  const cardHeaderStyle = styles.cardHeader;
  const cardIconStyle = styles.cardIcon;
  const titleStyle = [styles.title, darkMode && { color: '#fff' }];
  const sectionTitleStyle = [styles.sectionTitle, darkMode && { color: '#fff' }];
  const textStyle = [styles.text, darkMode && { color: '#bbb' }];
  const avgTextStyle = [styles.avgText, darkMode && { color: spendingDanger ? '#ff7675' : '#bbb' }];
  const summaryRowStyle = styles.summaryRow;
  const summaryCardStyle = [styles.summaryCard, darkMode && styles.cardDark];
  const summaryLabelStyle = [styles.summaryLabel, darkMode && { color: '#aaa' }];
  const summaryValueStyle = [styles.summaryValue, darkMode && { color: darkMode ? '#70d7c7' : '#2980b9' }];
  const summaryCommentStyle = [styles.summaryComment, darkMode && { color: '#aaa' }];
  const riskCardStyle = [styles.card, styles.riskCard, darkMode && styles.cardDark, { borderColor: riskColor }];
  const riskDescStyle = [styles.riskDesc, { color: riskColor }];
  const clickGuideTextStyle = [styles.clickGuideText, darkMode && { color: '#bbb' }];

  return (
    <View style={containerStyle}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 타이틀 */}
        <Text style={titleStyle}>지출 플래너</Text>

        {/* 주간 지출 추이 카드 */}
        <View style={chartCardStyle}>
          <View style={cardHeaderStyle}>
            <Text style={cardIconStyle}>📊</Text>
            <Text style={sectionTitleStyle}>주간 지출 추이</Text>
          </View>
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: spendingLabels,
                datasets: [{ data: spendingData }],
              }}
              width={windowWidth - 48}
              height={180}
              yAxisSuffix="만"
              chartConfig={{
                backgroundColor: darkMode ? '#292B36' : '#fff',
                backgroundGradientFrom: darkMode ? '#292B36' : '#fff',
                backgroundGradientTo: darkMode ? '#181A20' : '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) =>
                  spendingDanger
                    ? `rgba(231,76,60,${opacity})`
                    : darkMode
                    ? `rgba(112,215,199,${opacity})`
                    : `rgba(41,128,185,${opacity})`,
                labelColor: (opacity = 1) => (darkMode ? '#bbb' : '#7f8c8d'),
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: spendingDanger ? '#e74c3c' : darkMode ? '#70d7c7' : '#2980b9',
                },
              }}
              bezier
              style={{ borderRadius: 12 }}
              withInnerLines={false}
              withOuterLines={false}
              fromZero
            />
          </View>
          <Text style={avgTextStyle}>
            최근 일평균 지출: {avgSpending.toLocaleString()}만원
            {spendingDanger ? ' (위험: 지출이 많아요!)' : ' (안정)'}
          </Text>
        </View>

        {/* 일일/월간 지출 카드 */}
        <View style={summaryRowStyle}>
          <View style={summaryCardStyle}>
            <Text style={summaryLabelStyle}>일일 지출</Text>
            <Text style={summaryValueStyle}>150,000원</Text>
            <Text style={summaryCommentStyle}>어제 대비 +12%</Text>
          </View>
          <View style={summaryCardStyle}>
            <Text style={summaryLabelStyle}>월간 지출</Text>
            <Text style={summaryValueStyle}>4,500,000원</Text>
            <Text style={summaryCommentStyle}>예산 대비 23% 초과</Text>
          </View>
        </View>

        {/* 위험도 분석 카드 */}
        <TouchableOpacity
          style={riskCardStyle}
          onPress={() => navigation.navigate('Risk', { riskValue })}
          activeOpacity={0.85}
        >
          <View style={cardHeaderStyle}>
            <Text style={cardIconStyle}>🛡️</Text>
            <Text style={sectionTitleStyle}>지출 위험도 분석</Text>
          </View>
          <Text style={styles.gaugeText}>현재 위험도: {riskValue}%</Text>
          <Text style={riskDescStyle}>{riskDesc}</Text>
          <Text style={clickGuideTextStyle}>터치하면 상세 분석 화면으로 이동</Text>
        </TouchableOpacity>
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
  chartCard: {
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
  text: {
    fontSize: 17,
    color: '#555',
    marginTop: 4,
  },
  avgText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 0,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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
  riskCard: {
    borderWidth: 2,
    borderColor: '#b6e2c7',
    marginBottom: 18,
  },
  gaugeText: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '600',
    color: '#888',
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
