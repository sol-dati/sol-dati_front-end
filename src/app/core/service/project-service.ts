import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProjectInterface } from '../../models/projectInterface';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url = inject(API_URL) + '/project/';
  private _project = signal<ProjectInterface[]>([]);

  constructor(private http: HttpClient) { }

  project() {
    return this._project();
  }

  // legge dal DB
  list() {
    return this.http.get<ProjectInterface[]>(this.url + 'list').pipe(
      tap((resp) => this._project.set(resp))
    );
  }

  // salva su DB nome e tag presi da GitLab
  sync() {
    return this.http.post<{ nuoveRighe: number }>(this.url + 'sync', {});
  }

    // solo i tag con almeno un'analisi salvata, dall'analisi più recente
  analizzati() {
    return this.http.get<ProjectInterface[]>(this.url + 'analizzati');
  }
}