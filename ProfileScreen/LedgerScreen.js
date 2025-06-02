import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useThemeMode } from './ThemeContext';

export default function LedgerScreen() {
  const { darkMode } = useThemeMode();

  const [accountBalance, setAccountBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  const handleAddEntry = () => {
    if (!selectedDate || !amount || !description) return;
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount)) return;
    const newEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      amount: parsedAmount,
      description,
      type: parsedAmount >= 0 ? 'income' : 'expense',
    };
    setEntries(prev => [...prev, newEntry]);
    setAccountBalance(prev => prev + parsedAmount);
    setAmount('');
    setDescription('');
  };

  const handleBalanceChange = () => {
    const parsed = parseInt(balanceInput, 10);
    if (!isNaN(parsed)) {
      setAccountBalance(parsed);
    }
    setBalanceInput('');
  };

  useEffect(() => {
    const filtered = entries.filter(e => e.date.startsWith(selectedMonth));
    const incomeSum = filtered
      .filter(e => e.amount >= 0)
      .reduce((sum, e) => sum + e.amount, 0);
    const expenseSum = filtered
      .filter(e => e.amount < 0)
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);
    setMonthlyIncome(incomeSum);
    setMonthlyExpense(expenseSum);
  }, [selectedMonth, entries]);

  const getDateSummary = () => {
    const summary = {};
    entries.forEach(entry => {
      if (entry.date.startsWith(selectedMonth)) {
        if (!summary[entry.date]) summary[entry.date] = { income: 0, expense: 0 };
        if (entry.amount >= 0) summary[entry.date].income += entry.amount;
        else summary[entry.date].expense += Math.abs(entry.amount);
      }
    });
    return summary;
  };

  const getFormattedMonthTitle = (monthStr) => {
    const [year, month] = monthStr.split('-');
    return `${year}년 ${parseInt(month, 10)}월`;
  };

  const dateSummary = getDateSummary();

  const markedDates = {};
  Object.entries(dateSummary).forEach(([date, { income, expense }]) => {
    markedDates[date] = {
      customStyles: {
        container: {
          backgroundColor: darkMode ? '#333' : 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          paddingVertical: 5,
        },
        text: { color: darkMode ? '#fff' : '#000' },
      },
      income,
      expense,
      marked: true,
      dots: [
        ...(income ? [{ key: 'income', color: 'blue' }] : []),
        ...(expense ? [{ key: 'expense', color: 'red' }] : []),
      ],
    };
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: '#70d7c7',
    };
  }

  const renderDay = ({ date, state }) => {
    if (!date) return <View style={{ width: 36, height: 56 }} />;
    const dateStr = date.dateString;
    const summary = dateSummary[dateStr] || { income: 0, expense: 0 };
    const isSelected = selectedDate === dateStr;
    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDayContainer,
          state === 'disabled' && { opacity: 0.4 },
        ]}
        onPress={() => setSelectedDate(dateStr)}
      >
        <Text style={[
          styles.dayText,
          state === 'disabled' && { color: '#999' },
          darkMode && { color: '#fff' }
        ]}>
          {date.day}
        </Text>
        <View style={styles.dotsContainer}>
          {summary.income > 0 && <View style={[styles.dot, { backgroundColor: 'blue' }]} />}
          {summary.expense > 0 && <View style={[styles.dot, { backgroundColor: 'red' }]} />}
        </View>
        <View style={{ marginTop: 2, alignItems: 'center' }}>
          {summary.income > 0 && (
            <Text style={{ fontSize: 7, color: 'blue' }}>
              +{summary.income.toLocaleString('ko-KR')}
            </Text>
          )}
          {summary.expense > 0 && (
            <Text style={{ fontSize: 7, color: 'red' }}>
              -{summary.expense.toLocaleString('ko-KR')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.entryItem,
      darkMode && { backgroundColor: '#222', borderBottomColor: '#444' }
    ]}>
      <Text style={[
        styles.entryText,
        darkMode && { color: '#fff' }
      ]}>
        {item.date}: {item.description} - {item.amount.toLocaleString()}원
      </Text>
    </View>
  );

  // -와 숫자만 허용, 맨 앞에만 - 허용
  const handleAmountChange = (text) => {
    let filtered = text.replace(/[^0-9\-]/g, '');
    if (filtered.startsWith('-')) {
      filtered = '-' + filtered.slice(1).replace(/-/g, '');
    } else {
      filtered = filtered.replace(/-/g, '');
    }
    setAmount(filtered);
  };

  // 스타일 배열
  const containerStyle = [
    styles.container,
    darkMode && { backgroundColor: '#181A20' }
  ];

  // 선택된 날짜의 내역만 필터링
  const filteredEntries = entries.filter((entry) => entry.date === selectedDate);

  return (
    <SafeAreaView style={[containerStyle, {flex: 1}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* 계좌 잔액 카드 */}
      <View style={[styles.card, styles.balanceCard, darkMode && styles.cardDark]}>
        <Text style={[styles.cardTitle, darkMode && { color: '#70d7c7' }]}>현재 계좌 잔액</Text>
        <Text style={[styles.balanceValue, darkMode && { color: '#fff' }]}>{accountBalance.toLocaleString()}원</Text>
        <View style={styles.balanceInputRow}>
          <TextInput
            style={[styles.balanceInput, darkMode && { backgroundColor: '#222', color: '#fff', borderColor: '#555' }]}
            placeholder="잔액 수정"
            placeholderTextColor={darkMode ? "#bbb" : "#999"}
            keyboardType="numeric"
            value={balanceInput}
            onChangeText={setBalanceInput}
          />
          <TouchableOpacity style={styles.balanceButton} onPress={handleBalanceChange}>
            <Text style={styles.balanceButtonText}>수정</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 월별 요약 카드 */}
      <View style={styles.summaryRow}>
        <View style={[styles.card, styles.summaryCard, darkMode && styles.cardDark]}>
          <Text style={[styles.summaryTitle, darkMode && { color: '#fff' }]}>총 수입</Text>
          <Text style={[styles.summaryValue, darkMode && { color: '#70d7c7' }]}>{monthlyIncome.toLocaleString()}원</Text>
        </View>
        <View style={[styles.card, styles.summaryCard, darkMode && styles.cardDark]}>
          <Text style={[styles.summaryTitle, darkMode && { color: '#fff' }]}>총 지출</Text>
          <Text style={[styles.summaryValue, darkMode && { color: '#e74c3c' }]}>{monthlyExpense.toLocaleString()}원</Text>
        </View>
      </View>

      {/* 캘린더 카드 */}
      <View style={[styles.card, styles.calendarCard, darkMode && styles.cardDark]}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          onMonthChange={(month) =>
            setSelectedMonth(`${month.year}-${String(month.month).padStart(2, '0')}`)
          }
          dayComponent={renderDay}
          markingType={'custom'}
          markedDates={markedDates}
          style={styles.calendar}
          theme={{
            backgroundColor: darkMode ? '#222' : '#fff',
            calendarBackground: darkMode ? '#222' : '#fff',
            dayTextColor: darkMode ? '#fff' : '#000',
            textDisabledColor: darkMode ? '#555' : '#999',
            monthTextColor: darkMode ? '#fff' : '#000',
            arrowColor: darkMode ? "#fff" : "#000",
          }}
        />
      </View>

      {/* 입력 카드 */}
      <View style={[styles.card, styles.inputCard, darkMode && styles.cardDark]}>
        <Text style={[styles.cardTitle, darkMode && { color: '#70d7c7' }]}>내역 입력</Text>
        <TextInput
          style={[styles.input, darkMode && { backgroundColor: '#222', color: '#fff', borderColor: '#555' }]}
          placeholder="수입/지출 금액"
          placeholderTextColor={darkMode ? "#bbb" : "#999"}
          keyboardType="default"
          value={amount}
          onChangeText={handleAmountChange}
        />
        <Text style={[styles.hintText, darkMode && { color: '#ffb3b3' }]}>* 지출은 금액 앞에 '-'를 붙여 입력</Text>
        <TextInput
          style={[styles.input, darkMode && { backgroundColor: '#222', color: '#fff', borderColor: '#555' }]}
          placeholder="내용"
          placeholderTextColor={darkMode ? "#bbb" : "#999"}
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={[styles.button, darkMode && { backgroundColor: '#70d7c7' }]} onPress={handleAddEntry}>
          <Text style={[styles.buttonText, darkMode && { color: '#222' }]}>기록</Text>
        </TouchableOpacity>
      </View>

      {/* 내역 리스트 카드 */}
      <View style={[styles.card, styles.entryListCard, darkMode && styles.cardDark]}>
        <Text style={[styles.entryListTitle, darkMode && { color: '#fff' }]}>내역</Text>
        {filteredEntries.length > 0 ? (
          filteredEntries.map(item => (
            <View 
              key={item.id}
              style={[
                styles.entryItem,
                darkMode && { backgroundColor: '#222', borderBottomColor: '#444' }
              ]}
            >
              <Text style={[
                styles.entryText,
                darkMode && { color: '#fff' }
              ]}>
                {item.date}: {item.description} - {item.amount.toLocaleString()}원
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.noDataText, darkMode && { color: '#aaa' }]}>내역이 없습니다</Text>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F4F7FA',
    paddingTop: 32,
    paddingBottom: 32,
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
  balanceCard: { alignItems: 'center' },
  balanceValue: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  balanceInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  balanceInput: {
    flex: 1,
    height: 38,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
  balanceButton: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  balanceButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, gap: 10 },
  summaryCard: { flex: 1, alignItems: 'center', paddingVertical: 18, marginBottom: 0 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: '#2980b9' },
  calendarCard: { padding: 0 },
  calendar: { borderRadius: 10, overflow: 'hidden', alignSelf: 'center' },
  dayContainer: { width: 40, height: 35, alignItems: 'center' },
  selectedDayContainer: { backgroundColor: '#EAF3E1', borderRadius: 20 },
  dayText: { fontSize: 12, color: '#000' },
  dotsContainer: { flexDirection: 'row', marginTop: 0 },
  dot: { width: 5, height: 6, borderRadius: 3, marginHorizontal: 1 },
  inputCard: {},
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2980b9', marginBottom: 8 },
  input: {
    height: 38,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    color: '#222',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  hintText: { color: 'red', marginBottom: 4, fontSize: 11, paddingLeft: 4 },
  button: { backgroundColor: '#2980b9', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  entryListCard: { paddingBottom: 8 },
  entryListTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  entryItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderColor: '#eee',
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryText: { fontSize: 15, color: '#222', flex: 1 },
  noDataText: { fontSize: 14, color: '#888', textAlign: 'center', paddingVertical: 15 },
});
