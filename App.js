import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './contexts/ThemeContext'; // 추가
import { UserProvider } from './contexts/UserContext';
import MyPageScreen from './screens/MyPageScreen';
import RiskScreen from './screens/RiskScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignUpScreen from './screens/SignUpScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === '회원가입') iconName = 'person-add';
          else if (route.name === '위험도 분석') iconName = 'warning';
          else if (route.name === '설정') iconName = 'settings';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#95a5a6',
      })}
    >
      <Tab.Screen
        name="회원가입"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="위험도 분석"
        component={RiskScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="설정"
        component={SettingsStackScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </UserProvider>
    </ThemeProvider>
  );
}
