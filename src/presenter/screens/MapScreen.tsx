import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Location } from '../../domain/entities/Vehicle';

export default function MapScreen({ route }: any) {
  const { vehicleId } = route.params;
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.1.90:3000/locations?vehicleId=${vehicleId}`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: Location, b: Location) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setLocations(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (loading || locations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: locations[0].latitude,
    longitude: locations[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
      {locations.map((loc, index) => (
        <Marker
          key={loc.id}
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
          title={`Velocidade: ${loc.speed.toFixed(1)} km/h`}
          description={new Date(loc.timestamp).toLocaleString('pt-BR')}
          pinColor={index === locations.length - 1 ? 'green' : 'red'}
        />
      ))}
      <Polyline
        coordinates={locations.map(loc => ({ latitude: loc.latitude, longitude: loc.longitude }))}
        strokeColor="blue"
        strokeWidth={3}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
