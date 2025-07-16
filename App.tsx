import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/presenter/screens/LoginScreen';
import VehicleListScreen from './src/presenter/screens/VehicleListScreen';
import MapScreen from './src/presenter/screens/MapScreen';

export const AuthContext = createContext<any>(null);
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Vehicles" component={VehicleListScreen} options={{ title: 'Seus Veículos' }} />
              <Stack.Screen name="Map" component={MapScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}