import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Vehicle } from '../../domain/entities/Vehicle';
import { useAuth } from '../../context/AuthContext';
import { getVehiclesUseCase } from '../../di';
import Icon from 'react-native-vector-icons/Feather';

export default function VehicleListScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // <-- novo estado
  const { user, token, logout } = useAuth();

  const loadVehicles = useCallback(async () => {
    if (user && token) {
      try {
        const data = await getVehiclesUseCase.execute(user.id, token);
        setVehicles(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      }
    }
  }, [user, token]);

  useEffect(() => {
    setLoading(true);
    loadVehicles().finally(() => setLoading(false));
  }, [loadVehicles]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout(); // <-- Certifique-se de que logout remove o token
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Veículos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onRefresh} style={styles.iconButton}>
            <Icon name="refresh-ccw" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <Icon name="log-out" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>


      {loading ? (
        <ActivityIndicator size="large" color="#0D47A1" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Map', { vehicleId: item.id })}
            >
              <Text style={styles.title}>{item.marca} {item.modelo}</Text>
              <Text style={styles.subtitle}>{item.placa} • {item.ano} • {item.cor}</Text>
              <Text style={styles.type}>{item.tipo}</Text>
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
  type: {
    color: '#0D47A1',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  iconButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#0D47A1',
    borderRadius: 6,
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },


});
