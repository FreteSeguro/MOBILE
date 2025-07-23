import { config } from '../config';

export type WebSocketCommand = {
  action: 'start' | 'stop';
  vehicleId: number;
};

export type GpsWebSocketResponse = {
  vehicleId: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  timestamp: string;
};

export class GpsWebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, (data: GpsWebSocketResponse[]) => void> = new Map();

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${config.websocket.baseUrl}${config.websocket.endpoints.gps}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('🔌 WebSocket GPS conectado');
        resolve();
      };

      this.socket.onerror = (error) => {
        console.error('❌ Erro WebSocket GPS:', error);
        reject(error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data: GpsWebSocketResponse[] = JSON.parse(event.data);
          // Notificar todos os listeners
          this.listeners.forEach(callback => callback(data));
        } catch (error) {
          console.error('❌ Erro ao processar mensagem WebSocket:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('🔌 WebSocket GPS desconectado');
      };
    });
  }

  subscribe(id: string, callback: (data: GpsWebSocketResponse[]) => void) {
    this.listeners.set(id, callback);
  }

  unsubscribe(id: string) {
    this.listeners.delete(id);
  }

  startTracking(vehicleId: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const command: WebSocketCommand = { action: 'start', vehicleId };
      this.socket.send(JSON.stringify(command));
      console.log(`📡 Iniciando tracking do veículo ${vehicleId}`);
    }
  }

  stopTracking(vehicleId: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const command: WebSocketCommand = { action: 'stop', vehicleId };
      this.socket.send(JSON.stringify(command));
      console.log(`📡 Parando tracking do veículo ${vehicleId}`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const gpsWebSocketService = new GpsWebSocketService();
