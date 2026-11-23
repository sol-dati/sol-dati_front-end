export interface RuntimeEnv {
  apiUrl?: string;
  keycloakUrl?: string;
  keycloakRealm?: string;
  keycloakClientId?: string;
}

declare global {
  interface Window {
    __env?: RuntimeEnv;
  }
}

const runtimeEnv: RuntimeEnv = window.__env ?? {};

export const apiUrl = runtimeEnv.apiUrl ?? 'http://localhost:9090/api/sol-dati';
//export const apiUrl = runtimeEnv.apiUrl ?? 'https://egg-gateway.dev.expleoitalia.it/api/sol-dati';

export const keycloakEnv = {
  url: runtimeEnv.keycloakUrl ?? 'https://sso.dev.expleoitalia.it/',
  realm: runtimeEnv.keycloakRealm ?? 'egg',
  clientId: runtimeEnv.keycloakClientId ?? 'soldati',
};