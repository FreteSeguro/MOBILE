import { VehicleRepository } from '../../domain/repositories/VehicleRepository';
import { Vehicle, Location } from '../../domain/entities/Vehicle';
import { BASE_URL } from '@env';

const baseURL = BASE_URL;

export class VehicleApiDatasource implements VehicleRepository {
  async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
    const res = await fetch(`${baseURL}/vehicles?userId=${userId}`);
    return res.json();
  }

  async getLocationsByVehicleId(vehicleId: string): Promise<Location[]> {
    const res = await fetch(`${baseURL}/locations?vehicleId=${vehicleId}`);
    const data = await res.json();
    return data.sort(
      (a: Location, b: Location) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}