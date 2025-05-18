import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function MyPageScreen({ navigation }) {
  const { user, login } = useUser();
  const [editField, setEditField] = useState(null); // 수정 중인 필드 (예: 'name')
  const [tempValue, setTempValue] = useState(''); // 임시 수정 값
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 필드 수정 시작
  const startEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
    setIsModalVisible(true);
  };

  // 수정 저장
  const saveEdit = () => {
    if (editField) {
      const updatedUser = { ...user, [editField]: tempValue };
      login(updatedUser); // 전역 상태 업데이트
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name}님의 정보</Text>
      </View>

      {/* 정보 리스트 */}
      <View style={styles.infoList}>
        <InfoRow label="이름" value={user.name} onPress={() => startEdit('name', user.name)} />
        <InfoRow label="생년월일" value={user.birth} onPress={() => startEdit('birth', user.birth)} />
        <InfoRow label="휴대폰 번호" value={user.phone} onPress={() => startEdit('phone', user.phone)} />
        <InfoRow label="이메일" value={user.email} onPress={() => startEdit('email', user.email)} />
        <InfoRow label="주소" value={user.address} onPress={() => startEdit('address', user.address)} />
      </View>

      {/* 수정 모달 */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={`새로운 ${editField} 입력`}
            />
            <View style={styles.modalButtons}>
              <Button title="취소" onPress={() => setIsModalVisible(false)} />
              <Button title="저장" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 정보 한 줄 컴포넌트
function InfoRow({ label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.infoRow} onPress={onPress}>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '정보 없음'}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 56,
    backgroundColor: '#E9F3E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 12,
  },
  infoList: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
