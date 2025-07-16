import { VehicleRepository } from "../../domain/repositories/VehicleRepository";
import { Vehicle, Location } from "../../domain/entities/Vehicle";
import { VehicleDataSource } from "../datasources/vehicle.datasource";

export class VehicleRepositoryImpl implements VehicleRepository {
  constructor(private dataSource: VehicleDataSource) {}

  getVehicles(): Promise<Vehicle[]> {
    return this.dataSource.getVehicles();
  }

  getVehicleLocations(vehicleId: string): Promise<Location[]> {
    return this.dataSource.getVehicleLocations(vehicleId);
  }
}