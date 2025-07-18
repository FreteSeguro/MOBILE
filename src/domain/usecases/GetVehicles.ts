import { VehicleRepository } from '../repositories/VehicleRepository';
import { Vehicle } from '../entities/Vehicle';

export class GetVehicles {
  constructor(private repository: VehicleRepository) {}

  execute(userId: number, token: string): Promise<Vehicle[]> {
    return this.repository.getVehiclesByUserId(userId, token);
  }
}