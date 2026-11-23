import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { API_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root'
})
export class GitLabService {

  private url = inject(API_URL) + '/gitlab/';

  private _projects = signal<string[]>([]);
  private _tags = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  projects() {
    return this._projects();
  }

  tags() {
    return this._tags();
  }

  listProjects() {
    return this.http.get<string[]>(this.url + 'projects').pipe(
      tap((resp) => this._projects.set(resp))
    );
  }

  tagsProject(projectName: string) {
    return this.http.get<string[]>(this.url + 'projects/' + projectName + '/tags').pipe(
      tap((resp) => this._tags.set(resp))
    );
  }

    clearTags() {
    this._tags.set([]);
  }
}