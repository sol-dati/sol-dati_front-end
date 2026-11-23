import { InjectionToken } from '@angular/core';
import { apiUrl } from './env';

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => apiUrl,
});