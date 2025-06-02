import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useThemeMode } from './ThemeContext';
import { useUser } from './UserContext';

export default function MyPageScreen({ navigation }) {
  const { user, login } = useUser();
  const { darkMode } = useThemeMode();

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const containerStyle = [styles.container, darkMode && { backgroundColor: '#181A20' }];
  const cardStyle = [styles.card, darkMode && styles.cardDark];
  const headerTitleStyle = [styles.headerTitle, darkMode && { color: '#fff' }];
  const infoLabelStyle = [styles.infoLabel, darkMode && { color: '#bbb' }];
  const infoValueStyle = [styles.infoValue, darkMode && { color: '#fff' }];
  const editButtonStyle = [styles.editButton, darkMode && { backgroundColor: '#444' }];
  const editButtonTextStyle = [styles.editButtonText, darkMode && { color: '#70d7c7' }];
  const modalContentStyle = [styles.modalContent, darkMode && { backgroundColor: '#23262F' }];
  const modalInputStyle = [styles.modalInput, darkMode && { color: '#fff', borderBottomColor: '#70d7c7', backgroundColor: '#181A20' }];
  const modalButtonStyle = [styles.modalButton, darkMode && { backgroundColor: '#2980b9' }];
  const modalButtonTextStyle = [styles.modalButtonText, darkMode && { color: '#fff' }];

  const startEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
    setIsModalVisible(true);
  };

  const saveEdit = () => {
    if (editField) {
      const updatedUser = { ...user, [editField]: tempValue };
      login(updatedUser);
      setIsModalVisible(false);
    }
  };

  // 프로필 정보 필드 정의
  const fields = [
    { key: 'name', label: '이름', icon: '👤' },
    { key: 'birth', label: '생년월일', icon: '🎂' },
    { key: 'phone', label: '전화번호', icon: '📱' },
    { key: 'email', label: '이메일', icon: '✉️' },
    { key: 'address', label: '주소', icon: '🏠' },
  ];

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={headerTitleStyle}>내 정보 수정</Text>
        </View>

        {/* 프로필 카드 */}
        <View style={cardStyle}>
          <View style={styles.profileIconRow}>
            <Text style={styles.profileIcon}>🧑</Text>
            <Text style={styles.profileName}>{user.name || '이름 없음'}</Text>
          </View>
          <Text style={styles.profileEmail}>{user.email || '이메일 없음'}</Text>
        </View>

        {/* 정보 수정 카드 */}
        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          {fields.map((field) => (
            <View key={field.key} style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Text style={styles.infoFieldIcon}>{field.icon}</Text>
                <Text style={infoLabelStyle}>{field.label}</Text>
              </View>
              <View style={styles.infoRight}>
                <Text style={infoValueStyle}>{user[field.key] || '정보 없음'}</Text>
                <TouchableOpacity
                  style={editButtonStyle}
                  onPress={() => startEdit(field.key, user[field.key] || '')}
                  activeOpacity={0.8}
                >
                  <Text style={editButtonTextStyle}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 정보 수정 모달 */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={modalContentStyle}>
            <Text style={styles.modalTitle}>정보 수정</Text>
            <TextInput
              style={modalInputStyle}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder="새 값을 입력하세요"
              placeholderTextColor={darkMode ? "#bbb" : "#888"}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={modalButtonStyle} onPress={saveEdit}>
                <Text style={modalButtonTextStyle}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalButtonStyle, { backgroundColor: darkMode ? '#222' : '#eee' }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={[modalButtonTextStyle, { color: darkMode ? '#ff7675' : '#e74c3c' }]}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: Platform.OS === 'ios' ? 56 : 30, backgroundColor: '#F4F7FA' },
  header: { marginBottom: 18, alignItems: 'center' },
  headerTitle: { fontSize: 25, fontWeight: 'bold', color: '#215b36', letterSpacing: 1 },
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
  profileIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  profileIcon: { fontSize: 34, marginRight: 8 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#2980b9' },
  profileEmail: { fontSize: 15, color: '#888', marginLeft: 6, marginBottom: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#2980b9', marginBottom: 10 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoFieldIcon: { fontSize: 17, marginRight: 3 },
  infoLabel: { fontSize: 15, color: '#888' },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoValue: { fontSize: 17, color: '#222', fontWeight: '500', marginRight: 6 },
  editButton: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginLeft: 4,
  },
  editButtonText: { color: '#2980b9', fontWeight: 'bold', fontSize: 14 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 24, backgroundColor: 'white', borderRadius: 12, alignItems: 'center' },
  modalTitle: { fontSize: 19, fontWeight: 'bold', marginBottom: 18, color: '#2980b9' },
  modalInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#2980b9',
    marginBottom: 20,
    fontSize: 16,
    padding: 8,
    color: '#222',
    backgroundColor: '#fff',
    width: '100%',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 8, gap: 12 },
  modalButton: {
    backgroundColor: '#2980b9',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
