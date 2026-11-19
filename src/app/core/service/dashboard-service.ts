import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IsoSintesi } from '../../models/iso-sintesi';
import { KpiIso } from '../../models/kpi-iso';
import { IssueSezione } from '../../models/issue';
import { DimensioneCodice } from '../../models/dimensione-codice';

import { API_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private url = inject(API_URL) + '/rest/dashboard';

  // compliance per categoria iso dell'ultima analisi del tag
  sintesi(projectId: number): Observable<IsoSintesi[]> {
    return this.http.get<IsoSintesi[]>(`${this.url}/${projectId}/sintesi`);
  }

  // kpi della categoria con valore ed esito
  kpiIso(projectId: number, isoCode: string): Observable<KpiIso[]> {
    return this.http.get<KpiIso[]>(`${this.url}/${projectId}/iso/${encodeURIComponent(isoCode)}`);
  }

    // kpi blocker e critical dell'ultima analisi del tag
  issue(projectId: number): Observable<IssueSezione[]> {
    return this.http.get<IssueSezione[]>(`${this.url}/${projectId}/issue`);
  }

    // file e righe di codice dell'ultima analisi del tag
  dimensioneCodice(projectId: number): Observable<DimensioneCodice> {
    return this.http.get<DimensioneCodice>(`${this.url}/${projectId}/dimensione`);
  }
}