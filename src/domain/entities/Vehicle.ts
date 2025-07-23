export interface Vehicle {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  tipo: string;
}

export interface Location {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  speed: number;
  timestamp: string;
}