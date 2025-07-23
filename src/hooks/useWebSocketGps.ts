import { useEffect, useRef, useState, useCallback } from 'react';
import { config } from '../config';

export type GpsPosition = {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  timestamp?: string;
};

interface UseWebSocketGpsProps {
  vehicleId: number;
  onLocationUpdate?: (locations: GpsPosition[]) => void;
}

export const useWebSocketGps = ({ vehicleId, onLocationUpdate }: UseWebSocketGpsProps) => {
  const [locations, setLocations] = useState<GpsPosition[]>([]);
  const [connected, setConnected] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    // Evitar múltiplas conexões
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${config.websocket.baseUrl}${config.websocket.endpoints.gps}`;
    console.log('🔌 Tentando conectar ao WebSocket:', wsUrl);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ Conectado ao WebSocket GPS');
      setConnected(true);
      setError(null);
      
      // Iniciar tracking automaticamente após conexão
      socket.send('start');
      console.log('📤 Iniciando tracking automaticamente');
      setStreaming(true);
      setLocations([]); // Limpar localizações anteriores
    };

    socket.onmessage = (event) => {
      try {
        const parsedData: GpsPosition[] = JSON.parse(event.data);
        console.log('📊 Localizações recebidas:', parsedData);
        
        setLocations(prev => [...prev, ...parsedData]);
        
        if (onLocationUpdate) {
          onLocationUpdate(parsedData);
        }
      } catch (e) {
        console.error('❌ Erro ao analisar mensagem GPS:', e);
        setError('Erro ao processar dados de localização');
      }
    };

    socket.onerror = (error) => {
      console.error('❌ Erro WebSocket GPS:', error);
      setError('Erro de conexão WebSocket');
    };

    socket.onclose = () => {
      console.log('🔌 Conexão WebSocket GPS fechada');
      setConnected(false);
      setStreaming(false);
    };
  }, []);

  const startTracking = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Para testes, só enviamos o comando 'start' sem ID do veículo
      socketRef.current.send('start');
      console.log(`📤 Iniciando tracking (modo teste)`);
      setStreaming(true);
      setLocations([]); // Limpar localizações anteriores
    }
  }, []);

  const stopTracking = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send('stop');
      console.log(`📤 Parando tracking (modo teste)`);
      setStreaming(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Desconectando WebSocket GPS');
      socketRef.current.close();
      socketRef.current = null;
    }
    setConnected(false);
    setStreaming(false);
  }, []);

  // Conectar automaticamente quando o hook for montado
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []); // Dependência vazia para conectar apenas uma vez

  return {
    locations,
    connected,
    streaming,
    error,
    startTracking,
    stopTracking,
    clearLocations: () => setLocations([]),
  };
};
