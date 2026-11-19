import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AvviaSq } from '../../models/avvia-sq';
import { SonarResultDTO } from '../../models/sonar-result-dto';

import { API_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root'
})
export class SonarService {

  private http = inject(HttpClient);

  private url = inject(API_URL) + '/rest/sonar';

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  avviaAnalisi(request: AvviaSq): Observable<SonarResultDTO> {

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    return this.http.post<SonarResultDTO>(`${this.url}/avvia`, request).pipe(tap((response) => {
        this.successMessage.set(
          `Analisi completata: ${response.projectKey}`
        );
      }),
      finalize(() => this.loading.set(false))
    );
  }
}