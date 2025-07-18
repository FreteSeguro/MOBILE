import { VehicleApiDatasource } from '../infra/datasources/VehicleApiDatasource';
import { UserApiDatasource } from '../infra/datasources/UserApiDatasource';
import { GetVehicles } from '../domain/usecases/GetVehicles';
import { GetLocations } from '../domain/usecases/GetLocations';
import { AuthenticateUser } from '../domain/usecases/AuthenticateUser';
import { RegisterUser } from '../domain/usecases/RegisterUser';

// Repositories/Datasources
const vehicleRepository = new VehicleApiDatasource();
const userRepository = new UserApiDatasource();

// Use Cases
export const getVehiclesUseCase = new GetVehicles(vehicleRepository);
export const getLocationsUseCase = new GetLocations(vehicleRepository);
export const authenticateUserUseCase = new AuthenticateUser(userRepository);
export const registerUserUseCase = new RegisterUser(userRepository);