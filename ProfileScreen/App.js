import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen.js';
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';
import SearchAddressScreen from './SearchAddress'; // 주소검색 스크린

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SearchAddress" component={SearchAddressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
