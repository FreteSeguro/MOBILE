import { VehicleRepository } from '../../domain/repositories/VehicleRepository';
import { Vehicle, Location } from '../../domain/entities/Vehicle';

const BASE_URL = 'http://192.168.1.90:3000';

export class VehicleApiDatasource implements VehicleRepository {
  async getVehicles(): Promise<Vehicle[]> {
    const res = await fetch(`${BASE_URL}/vehicles`);
    return res.json();
  }

  async getLocationsByVehicleId(vehicleId: string): Promise<Location[]> {
    const res = await fetch(`${BASE_URL}/locations?vehicleId=${vehicleId}`);
    const data = await res.json();
    return data.sort(
      (a: Location, b: Location) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}