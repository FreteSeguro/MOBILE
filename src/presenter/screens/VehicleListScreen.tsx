import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Vehicle } from '../../domain/entities/Vehicle';
import { AuthContext } from '../../../App';

export default function VehicleListScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://192.168.1.90:3000/vehicles?userId=${user}`)
      .then(res => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Sair" onPress={() => setUser(null)} />
      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Map', { vehicleId: item.id })}
          >
            <Text style={styles.title}>{item.model}</Text>
            <Text>{item.plate} | {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { backgroundColor: '#eee', marginVertical: 5, padding: 10, borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 16 },
});
