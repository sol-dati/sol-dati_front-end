import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
} from 'keycloak-angular';
import { apiUrl, keycloakEnv } from './core/config/env';

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Project } from './features/project/project';
import { Nav } from './shared/nav/nav';
import { Home } from './features/home/home';
import { Footer } from './shared/footer/footer';
import { ProjectSelect } from './features/project/project-select/project-select';
import { TagTable } from './features/project/tag-table/tag-table';
import { Dashboard } from './features/project/dashboard/dashboard';
import { SonarResult } from './features/project/sonar-result/sonar-result';
import { Fact } from './features/project/fact/fact';
import { KpiManuali } from './features/project/kpi-manuali/kpi-manuali';
import { AnalisiDettaglio } from './features/project/analisi-dettaglio/analisi-dettaglio';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// il token viene aggiunto solo alle chiamate verso il nostro backend
const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp('^' + escapeRegex(apiUrl) + '(/.*)?$', 'i'),
  bearerPrefix: 'Bearer',
});

@NgModule({
  declarations: [
    App,
    Project,
    Nav,
    Home,
    Footer,
    ProjectSelect,
    TagTable,
    Dashboard,
    SonarResult,
    Fact,
    KpiManuali,
    AnalisiDettaglio,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    /*provideBrowserGlobalErrorListeners(),
    provideKeycloak({
      config: {
        url: keycloakEnv.url,
        realm: keycloakEnv.realm,
        clientId: keycloakEnv.clientId,
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      },
      providers: [
        { provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [apiCondition] },
      ],
    }),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
  */],
  bootstrap: [App],
})
export class AppModule {}
