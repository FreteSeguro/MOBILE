import { VehicleApiDatasource } from '../infra/datasources/VehicleApiDatasource';
import { GetVehicles } from '../domain/usecases/GetVehicles';
import { GetLocations } from '../domain/usecases/GetLocations';

const repository = new VehicleApiDatasource();
export const getVehiclesUseCase = new GetVehicles(repository);
export const getLocationsUseCase = new GetLocations(repository);