import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, Subject, switchMap, timer } from 'rxjs';

import { ProjectService } from '../../core/service/project-service';
import { SonarService } from '../../core/service/sonar-service';
import { ProjectInterface } from '../../models/projectInterface';
import { SonarResultDTO } from '../../models/sonar-result-dto';
import { StatoAnalisi } from '../../models/stato-analisi';
import { TagRow } from '../../models/tag-row';

@Component({
  selector: 'app-project',
  standalone: false,
  styleUrl: './project.css',
  templateUrl: './project.html',
})
export class Project implements OnInit {

  private projectService = inject(ProjectService);
  sonarService = inject(SonarService);
  private destroyRef = inject(DestroyRef);

  projectSelected = output<ProjectInterface>();

  // righe del DB: nomi, tag, release, sprint, data, stato
  private allProjects = signal<ProjectInterface[]>([]);

  selectedProjectName = signal('');
  selectedTag = signal<string | null>(null);
  syncing = signal(false);

  // pannello dei kpi manuali del tag selezionato
  mostraKpiManuali = signal(false);

  // risultati Sonar, con chiave "nomeProgetto|tag"
  private sonarResults = signal(new Map<string, SonarResultDTO>());

  // niente stato vecchio che sovrascrive quello nuovo
  private ricarica$ = new Subject<void>();

  // analisi in corso lette dal DB: sopravvivono a ricaricamento e cambio pagina
  analisiInCorso = computed(() =>
    this.allProjects().filter(p => p.statoId === StatoAnalisi.IN_CORSO)
  );

  // nomi per la select, dal DB
  projects = computed(() =>
    [...new Set(this.allProjects().map(p => p.projectName))].sort()
  );

  // righe della tabella: release e sprint più alti in alto, righe da compilare in fondo
  rows = computed<TagRow[]>(() => {
    const nome = this.selectedProjectName();

    return this.allProjects()
      .filter(p => p.projectName === nome)
      .map(p => ({
        tag: p.tag,
        release: p.releaseNumber ?? null,
        sprint: p.sprintNumber ?? null,
        dataInserimento: p.dataInserimento ?? null,
        descrizione: p.descrizione ?? null,
        dataInvioManuali: p.dataInvioManuali ?? null,
        statoId: p.statoId ?? null
      }))
      .sort((a, b) => (b.release ?? -1) - (a.release ?? -1) || (b.sprint ?? -1) - (a.sprint ?? -1));
  });

  selectedRow = computed(() =>
    this.rows().find(r => r.tag === this.selectedTag()) ?? null
  );

  sonarResult = computed(() => {
    const tag = this.selectedTag();
    return tag ? this.sonarResults().get(this.chiaveRisultato(tag)) ?? null : null;
  });

  constructor() {
    //legge la lista dal DB
    this.ricarica$.pipe(
      switchMap(() => this.projectService.list().pipe(
        catchError(err => {
          console.error('ERRORE DB:', err);
          return EMPTY;            // un errore non deve chiudere il flusso delle riletture
        })
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(resp => this.allProjects.set(resp));

    toObservable(computed(() => this.analisiInCorso().length > 0)).pipe(
      switchMap(attiva => attiva ? timer(5000, 5000) : EMPTY),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.caricaLista());
  }

  ngOnInit(): void {
    this.caricaLista();
  }

  private caricaLista(): void {
    this.ricarica$.next();
  }

  // salva i nuovi nomi/tag di gitLab nel DB e poi ricarica la lista
  onSync(): void {
    this.syncing.set(true);
    this.projectService.sync().subscribe({
      next: resp => {
        console.log('NUOVE RIGHE DA GITLAB:', resp.nuoveRighe);
        this.syncing.set(false);
        this.caricaLista();
      },
      error: err => {
        console.error('ERRORE SYNC GITLAB:', err);
        this.syncing.set(false);
      },
    });
  }

  onProjectChange(projectName: string): void {
    this.selectedProjectName.set(projectName);
    this.selectedTag.set(null);
    this.mostraKpiManuali.set(false);
  }

  onTagSelect(tag: string): void {
    this.selectedTag.set(tag);
    this.mostraKpiManuali.set(false);
  }

  onKpiManuali(): void {
    this.mostraKpiManuali.set(true);
  }

  // dopo il salvataggio chiude il pannello e rilegge la lista
  onKpiManualiSalvati(): void {
    this.mostraKpiManuali.set(false);
    this.caricaLista();
  }

  onAvviaSq(): void {
    const row = this.selectedRow();

    if (!row) {
      return;
    }

    // la release serve per la chiave del progetto su Sonar
    if (row.release === null) {
      this.sonarService.errorMessage.set('Release mancante: impossibile avviare l\'analisi per il tag ' + row.tag);
      return;
    }

    const chiave = this.chiaveRisultato(row.tag);

    // il backend mette il tag "In corso" appena riceve la richiesta, continua da solo finché il tag è in corso
    timer(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.caricaLista());

    this.sonarService.avviaAnalisi({
      projectName: this.selectedProjectName(),
      release: row.release,
      sprint: row.sprint,
      tag: row.tag,
    }).pipe(
      // analisi finita (bene o male): legge lo stato finale
      finalize(() => this.caricaLista())
    ).subscribe({
      next: result => {
        console.log('RISULTATO SONAR:', result);
        this.sonarResults.update(m => new Map(m).set(chiave, result));
      },
      error: err => {
        console.error('ERRORE AVVIO SQ:', err);
        this.sonarService.errorMessage.set(
          err?.error ?? 'Errore durante l avvio dell analisi SonarQube'
        );
      },
    });
  }

  private chiaveRisultato(tag: string): string {
    return this.selectedProjectName() + '|' + tag;
  }
}