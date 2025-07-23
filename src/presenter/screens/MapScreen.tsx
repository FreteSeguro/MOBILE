import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Location } from '../../domain/entities/Vehicle';
import { useWebSocketGps, GpsPosition } from '../../hooks/useWebSocketGps';

export default function MapScreen({ route }: any) {
  const { vehicleId } = route.params;
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  // WebSocket para localizações em tempo real
  const {
    connected,
    streaming,
    error,
    stopTracking,
  } = useWebSocketGps({
    vehicleId,
    onLocationUpdate: (newLocations: GpsPosition[]) => {
      // Converter GpsPosition para Location
      const convertedLocations: Location[] = newLocations.map((pos, index) => ({
        id: `realtime-${Date.now()}-${index}`,
        vehicleId: vehicleId.toString(),
        latitude: pos.latitude,
        longitude: pos.longitude,
        altitude: pos.altitude,
        speed: pos.speed,
        timestamp: pos.timestamp || new Date().toISOString(),
      }));

      // Adicionar às localizações existentes
      setAllLocations(prev => [...prev, ...convertedLocations]);
      
      // Parar o loading quando receber os primeiros dados
      if (loading) {
        setLoading(false);
      }

      // Centralizar mapa na localização mais recente
      if (convertedLocations.length > 0 && mapRef.current) {
        const lastLocation = convertedLocations[convertedLocations.length - 1];
        mapRef.current.animateToRegion({
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    }
  });

  // Cleanup quando o componente for desmontado
  useEffect(() => {
    return () => {
      console.log('🧹 MapScreen desmontado - parando tracking');
      stopTracking();
    };
  }, [stopTracking]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D47A1" />
        <Text>Conectando ao rastreamento...</Text>
      </View>
    );
  }

  if (allLocations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.infoText}>
          {connected 
            ? (streaming ? 'Aguardando localizações...' : 'Conectado - Iniciando rastreamento...') 
            : 'Conectando ao servidor...'
          }
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  const initialRegion = {
    latitude: allLocations[0].latitude,
    longitude: allLocations[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Indicador de status do WebSocket */}
      <View style={styles.statusBar}>
        <Text style={[styles.statusText, { color: connected ? '#4CAF50' : '#F44336' }]}>
          {connected ? (streaming ? `🟢 Rastreamento ativo • ${allLocations.length} pontos` : '🟡 Conectado') : '🔴 Desconectado'}
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <MapView 
        ref={mapRef}
        style={StyleSheet.absoluteFill} 
        initialRegion={initialRegion}
        mapPadding={{ top: 70, right: 0, bottom: 0, left: 0 }}
      >
        {/* Mostrar apenas o marker da posição atual */}
        {allLocations.length > 0 && (() => {
          const currentLocation = allLocations[allLocations.length - 1];
          return (
            <Marker
              key={currentLocation.id}
              coordinate={{ 
                latitude: currentLocation.latitude, 
                longitude: currentLocation.longitude 
              }}
              title="🎯 Posição Atual"
              description={`Velocidade: ${currentLocation.speed.toFixed(1)} km/h\n${new Date(currentLocation.timestamp).toLocaleString('pt-BR')}${currentLocation.altitude ? `\nAltitude: ${currentLocation.altitude.toFixed(0)}m` : ''}`}
              pinColor="green"
            />
          );
        })()}
        {/* Linha do trajeto */}
        {allLocations.length > 1 && (
          <Polyline
            coordinates={allLocations.map(loc => ({ latitude: loc.latitude, longitude: loc.longitude }))}
            strokeColor="#2196F3"
            strokeWidth={5}
            lineDashPattern={[0]}
            lineJoin="round"
            lineCap="round"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 4,
  },
});
