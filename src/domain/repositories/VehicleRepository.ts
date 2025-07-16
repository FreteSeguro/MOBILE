import { Vehicle, Location } from '../entities/Vehicle';

export interface VehicleRepository {
  getVehicles(): Promise<Vehicle[]>;
  getLocationsByVehicleId(vehicleId: string): Promise<Location[]>;
}
