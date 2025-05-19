//인트로
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // 2초 후 자동으로 로그인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo_original.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>생활이 불안정한 모두를 위한 자립 지원 앱</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0e1', // 로고 배경과 비슷한 연한 초록
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 320,
    height: 120,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    color: '#215b36',
    fontWeight: '700',
    textAlign: 'center',
  },
});

