// valore per lo sviluppo locale (ng serve); nel container viene riscritto all'avvio da API_URL
window.__env = { apiUrl: 'http://localhost:9090/api/sol-dati' };

/*window.__env = {
  apiUrl: 'https://egg-gateway.dev.expleoitalia.it/api/sol-dati',
  keycloakUrl: 'https://sso.dev.expleoitalia.it',
  keycloakRealm: 'egg',
  keycloakClientId: 'soldati'
};*/
