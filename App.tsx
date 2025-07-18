import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/presenter/screens/LoginScreen';
import RegisterScreen from './src/presenter/screens/RegisterScreen';
import VehicleListScreen from './src/presenter/screens/VehicleListScreen';
import MapScreen from './src/presenter/screens/MapScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0D47A1',
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
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ 
                headerShown: false
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Vehicles"
              component={VehicleListScreen}
              options={{
                title: `Olá, ${user.name}!`,
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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
