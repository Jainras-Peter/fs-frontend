import { environment } from '../../../environments/environment';

const baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

export const API_CONFIG = {
  baseUrl,
  v1: `${baseUrl}/api/v1`,
  users: `${baseUrl}/api/users`,
  booking: `${baseUrl}/api/booking`,
  dashboard: `${baseUrl}/api/dashboard`
};
