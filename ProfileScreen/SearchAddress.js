// 주소찾기
import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import Postcode from '@thewoowon/react-native-daum-postcode';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchAddressScreen({ navigation }) {
  const handleAddressSelect = (data) => {
    // 주소 데이터 추출
    let fullAddress = data.address;
    let extraAddress = '';
    if (data.bname !== '') extraAddress += data.bname;
    if (data.buildingName !== '') {
      extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
    }
    if (extraAddress !== '') fullAddress += ` (${extraAddress})`;

    navigation.navigate('Profile', {
      zonecode: data.zonecode,
      address: fullAddress,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Postcode
          style={{ width: '100%', height: '100%' }}
          jsOptions={{ animation: true }}
          onSelected={handleAddressSelect}
          onError={(error) => Alert.alert('주소 검색 오류', JSON.stringify(error))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAFB',
  },
});
