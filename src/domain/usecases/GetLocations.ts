import { VehicleRepository } from '../repositories/VehicleRepository';
import { Location } from '../entities/Vehicle';

export class GetLocations {
  constructor(private repository: VehicleRepository) {}

  execute(vehicleId: string): Promise<Location[]> {
    return this.repository.getLocationsByVehicleId(vehicleId);
  }
}