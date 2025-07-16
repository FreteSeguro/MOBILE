import { Vehicle, Location } from '../entities/Vehicle';

export interface VehicleRepository {
  getVehiclesByUserId(userId: string): Promise<Vehicle[]>;
  getLocationsByVehicleId(vehicleId: string): Promise<Location[]>;
}
