import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native'; // 다크모드 감지

import AIPolicyScreen from './Screens/AIPolicyScreen';
import SettingsScreen from './Screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const systemDarkMode = useColorScheme() === 'dark';

  // 시스템 다크모드 상태로 초기 설정
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarStyle: {
          backgroundColor: darkMode ? '#333' : '#fff',
        },
      }}>
        <Tab.Screen
          name="AI 정책 추천"
          component={AIPolicyScreen}
          options={{ title: 'AI 정책 추천' }}
        />
        <Tab.Screen
          name="설정"
          component={SettingsScreen}
          options={{ title: '설정' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
