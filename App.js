import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import RiskScreen from './screens/RiskScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === '회원가입') {
              iconName = 'person-add';
            } else if (route.name === '위험도 분석') {
              iconName = 'warning';
            }
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
