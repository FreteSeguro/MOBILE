import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Vehicle } from '../../domain/entities/Vehicle';
import { useAuth } from '../../context/AuthContext';
import { getVehiclesUseCase } from '../../di';
import Icon from 'react-native-vector-icons/Feather';


export default function VehicleListScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      getVehiclesUseCase
        .execute(user)
        .then(setVehicles)
        .catch(error => {
          console.error(error);
          Alert.alert('Erro', 'Não foi possível carregar os veículos.');
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => setUser(null) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Veículos</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0D47A1" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Map', { vehicleId: item.id })}
            >
              <Text style={styles.title}>{item.model}</Text>
              <Text style={styles.subtitle}>{item.plate} • {item.status}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#F9F9F9' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },

  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#0D47A1',
    borderRadius: 6,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '500',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  subtitle: {
    color: '#666',
  },
});
