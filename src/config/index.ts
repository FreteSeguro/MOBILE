import { API_BASE_URL, BASE_URL, WS_BASE_URL } from '@env';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register',
      },
      vehicles: {
        byUser: (userId: number) => `/vehicles/user/${userId}`,
        locations: (vehicleId: string) => `/locations?vehicleId=${vehicleId}`,
      },
    },
  },
  websocket: {
    baseUrl: WS_BASE_URL,
    endpoints: {
      gps: '/gps-ws',
    },
  },
  app: {
    baseUrl: BASE_URL,
  },
} as const;

export default config;
