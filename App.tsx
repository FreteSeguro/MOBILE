import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/presenter/screens/LoginScreen';
import VehicleListScreen from './src/presenter/screens/VehicleListScreen';
import MapScreen from './src/presenter/screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0D47A1', // Azul escuro
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 22,
              fontWeight: 'bold',
            },
          }}
        >
          {!user ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Vehicles"
                component={VehicleListScreen}
                options={{
                  title: `Olá, ${user}!`, // título amigável
                }}
              />
              <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{ title: 'Localização do Veículo' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
