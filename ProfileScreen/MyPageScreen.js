//마이페이지
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeMode } from './ThemeContext'; // 경로 수정
import { useUser } from './UserContext';       // 경로 수정

export default function MyPageScreen({ navigation }) {
  const { user, login } = useUser();
  const { darkMode } = useThemeMode();
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const containerStyle = [
    styles.container,
    darkMode && { backgroundColor: '#222' },
  ];
  const headerTitleStyle = [
    styles.headerTitle,
    darkMode && { color: '#fff' },
  ];
  const modalContentStyle = [
    styles.modalContent,
    darkMode && { backgroundColor: '#222' },
  ];
  const modalInputStyle = [
    styles.modalInput,
    darkMode && { color: '#fff', borderBottomColor: '#555' },
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color={darkMode ? "#fff" : "#222"} />
        </TouchableOpacity>
        <Text style={headerTitleStyle}>{user.name}님의 정보</Text>
      </View>
      <View style={styles.infoList}>
        <InfoRow label="이름" value={user.name} onPress={() => startEdit('name', user.name)} darkMode={darkMode} />
        <InfoRow label="생년월일" value={user.birth} onPress={() => startEdit('birth', user.birth)} darkMode={darkMode} />
        <InfoRow label="전화번호" value={user.phone} onPress={() => startEdit('phone', user.phone)} darkMode={darkMode} />
        <InfoRow label="이메일" value={user.email} onPress={() => startEdit('email', user.email)} darkMode={darkMode} />
        <InfoRow label="주소" value={user.address} onPress={() => startEdit('address', user.address)} darkMode={darkMode} />
      </View>
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={modalContentStyle}>
            <TextInput
              style={modalInputStyle}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder="수정할 내용을 입력하세요"
              placeholderTextColor={darkMode ? "#888" : "#aaa"}
            />
            <View style={styles.modalButtons}>
              <Button onPress={saveEdit}>저장</Button>
              <Button onPress={() => setIsModalVisible(false)}>취소</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ label, value, onPress, darkMode }) {
  return (
    <TouchableOpacity style={styles.infoRow} onPress={onPress}>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, darkMode && { color: '#fff' }]}>{value || '정보 없음'}</Text>
      </View>
      <MaterialIcons name="edit" size={22} color={darkMode ? "#fff" : "#222"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 56, backgroundColor: '#E9F3E0' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 36 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#222', marginLeft: 12 },
  infoList: { marginTop: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#eee' },
  infoLabel: { fontSize: 15, color: '#888', marginBottom: 2 },
  infoValue: { fontSize: 18, color: '#222', fontWeight: '500' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalInput: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20, fontSize: 16, padding: 8, color: '#222' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
});
