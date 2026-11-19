import { InjectionToken } from '@angular/core';

declare global {
  interface Window {
    __env?: { apiUrl?: string };
  }
}

// indirizzo del backend, letto da env.js (generato all'avvio del container)
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => window.__env?.apiUrl ?? 'http://localhost:9090',
});