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
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
