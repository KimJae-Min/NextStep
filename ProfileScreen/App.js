//연결장치치
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './UserContext';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ProfileScreen from './ProfileScreen';
import Page from './Page';
import MyPageScreen from './MyPageScreen';
import SearchAddressScreen from './SearchAddress';
import RiskScreen from './RiskScreen';
import Planner from './Planner';
import PolicyRecommendation from './PolicyRecommendation';
import SettingsScreen from './SettingsScreen';
import LedgerScreen from './LedgerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Page" component={Page} />
            <Stack.Screen name="MyPage" component={MyPageScreen} />
            <Stack.Screen name="SearchAddress" component={SearchAddressScreen} />
            <Stack.Screen name="Risk" component={RiskScreen} />
            <Stack.Screen name="Planner" component={Planner} />
            <Stack.Screen name="PolicyRecommendation" component={PolicyRecommendation} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Ledger" component={LedgerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </ThemeProvider>
  );
}
