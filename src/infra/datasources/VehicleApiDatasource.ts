import { VehicleRepository } from '../../domain/repositories/VehicleRepository';
import { Vehicle, Location } from '../../domain/entities/Vehicle';

const API_BASE_URL = 'http://192.168.1.90:8080';

export class VehicleApiDatasource implements VehicleRepository {
  async getVehiclesByUserId(userId: number, token: string): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE_URL}/vehicles/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Erro ao buscar veículos: ${response.statusText}`);
      throw new Error('Erro ao buscar veículos');
    }

    return response.json();
  }

  async getLocationsByVehicleId(vehicleId: string): Promise<Location[]> {
    const res = await fetch(`${API_BASE_URL}/locations?vehicleId=${vehicleId}`);
    const data = await res.json();
    return data.sort(
      (a: Location, b: Location) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}
