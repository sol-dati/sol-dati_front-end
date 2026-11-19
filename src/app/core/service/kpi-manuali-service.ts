import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KpiManuale, KpiManualiReq } from '../../models/kpi-manuale';

import { API_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root'
})
export class KpiManualiService {

  private http = inject(HttpClient);

  private url = inject(API_URL) + '/rest/kpi-manuali';

  // KPI manuali del catalogo con i valori già inseriti per il tag
  list(projectName: string, tag: string): Observable<KpiManuale[]> {
    const params = new HttpParams().set('projectName', projectName).set('tag', tag);
    return this.http.get<KpiManuale[]>(`${this.url}/list`, { params });
  }

  // salva i valori (sostituiscono quelli precedenti del tag)
  salva(req: KpiManualiReq): Observable<void> {
    return this.http.post<void>(`${this.url}/create`, req);
  }
}
