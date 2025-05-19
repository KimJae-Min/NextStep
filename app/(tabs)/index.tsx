import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function LedgerScreen() {
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

    // 계좌 잔액 반영
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
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          paddingVertical: 5,
        },
        text: { color: '#000' },
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
        <Text style={[styles.dayText, state === 'disabled' && { color: '#999' }]}>
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
    <View style={styles.entryItem}>
      <Text style={styles.entryText}>
        {item.date}: {item.description} - {item.amount.toLocaleString()}원
      </Text>
    </View>
  );

  const handleAmountChange = (text) => {
    let filtered = text.replace(/[^0-9\-]/g, '');
    if (filtered.includes('-')) {
      filtered = '-' + filtered.replace(/-/g, '');
    }
    setAmount(filtered);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* 계좌 잔액 박스 */}
      <View style={styles.balanceBox}>
        <Text style={styles.balanceTitle}>현재 계좌 잔액</Text>
        <Text style={styles.balanceValue}>{accountBalance.toLocaleString()}원</Text>
        <View style={styles.balanceInputRow}>
          <TextInput
            style={styles.balanceInput}
            placeholder="잔액 수정"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={balanceInput}
            onChangeText={setBalanceInput}
          />
          <TouchableOpacity style={styles.balanceButton} onPress={handleBalanceChange}>
            <Text style={styles.balanceButtonText}>수정</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 월별 수입/지출 요약 */}
      <View style={styles.summaryBoxContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryMonth}>{getFormattedMonthTitle(selectedMonth)}</Text>
          <Text style={styles.summaryLabel}>총 수입</Text>
          <Text style={styles.summaryValue}>{monthlyIncome.toLocaleString()}원</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryMonth}>{getFormattedMonthTitle(selectedMonth)}</Text>
          <Text style={styles.summaryLabel}>총 지출</Text>
          <Text style={styles.summaryValue}>{monthlyExpense.toLocaleString()}원</Text>
        </View>
      </View>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={(month) =>
          setSelectedMonth(`${month.year}-${String(month.month).padStart(2, '0')}`)
        }
        dayComponent={renderDay}
        markingType={'custom'}
        markedDates={markedDates}
        style={styles.calendar}
      />

      {/* 입력창 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="수입/지출"
          placeholderTextColor="#999"
          keyboardType="default"
          value={amount}
          onChangeText={handleAmountChange}
        />
        <Text style={styles.hintText}>* 지출은 금액 앞에 '-'를 붙여 입력해주세요.</Text>
        <TextInput
          style={styles.input}
          placeholder="내용"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddEntry}>
          <Text style={styles.buttonText}>기록</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.entryListContainer}>
        <Text style={styles.entryListTitle}>내역</Text>
        <FlatList
          data={entries.filter((entry) => entry.date === selectedDate)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          nestedScrollEnabled={true}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  balanceBox: {
    backgroundColor: '#EAF3E1',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    color: '#000',
    marginBottom: 8,
  },
  balanceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceInput: {
    flex: 1,
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    color: '#000',
  },
  balanceButton: {
    backgroundColor: '#bbb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  balanceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#EAF3E1',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
  },
  summaryMonth: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  summaryValue: {
    fontSize: 18,
    color: '#000',
    marginTop: 2,
  },
  calendar: {
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  dayContainer: {
    width: 40,
    height: 35,
    alignItems: 'center',
  },
  selectedDayContainer: {
    backgroundColor: '#EAF3E1',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 12,
    color: '#000',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 0,
  },
  dot: {
    width: 5,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  inputContainer: {
    marginBottom: 10,
  },
  hintText: {
    color: 'red',
    marginBottom: 4,
    fontSize: 10,
    paddingLeft: 4,
  },
  input: {
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 3,
    color: '#000',
  },
  button: {
    backgroundColor: '#EAF3E1',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#445441',
    fontWeight: 'bold',
  },
  entryListContainer: {
    maxHeight: 300,
    marginTop: 10,
  },
  entryListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  entryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  entryText: {
    fontSize: 15,
  },
});




















