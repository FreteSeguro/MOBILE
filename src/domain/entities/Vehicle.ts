export interface Vehicle {
  id: string;
  userId: string;
  plate: string;
  model: string;
  type: string;
  status: string;
}

export interface Location {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: string;
}