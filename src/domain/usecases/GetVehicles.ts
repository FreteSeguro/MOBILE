import { VehicleRepository } from '../repositories/VehicleRepository';
import { Vehicle } from '../entities/Vehicle';

export class GetVehicles {
  constructor(private repository: VehicleRepository) {}

  execute(): Promise<Vehicle[]> {
    return this.repository.getVehicles();
  }
}