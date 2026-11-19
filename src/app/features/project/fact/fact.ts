import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ProjectService } from '../../../core/service/project-service';
import { ProjectInterface } from '../../../models/projectInterface';

// elenco dei tag analizzati (come la dashboard Compliance di Pentaho);
// con ?progetto=nome mostra solo le analisi di quel progetto.
// Il dettaglio della riga espansa è nel componente app-analisi-dettaglio
@Component({
  selector: 'app-fact',
  standalone: false,
  styleUrl: './fact.css',
  templateUrl: './fact.html',
})
export class Fact implements OnInit {

  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  // progetto passato dal bottone "Dashboard"; null = tutte le analisi
  progetto = toSignal(this.route.queryParamMap.pipe(map(p => p.get('progetto'))), { initialValue: null });

  // tutti i tag analizzati, dal più recente
  private tutti = signal<ProjectInterface[]>([]);

  // righe mostrate: solo quelle del progetto, se è stato indicato
  projects = computed(() => {
    const progetto = this.progetto();
    return progetto ? this.tutti().filter(p => p.projectName === progetto) : this.tutti();
  });

  expandedId = signal<number | null>(null);

  ngOnInit(): void {
    this.projectService.analizzati().subscribe({
      next: resp => this.tutti.set(resp),
      error: err => console.error('ERRORE PROGETTI:', err),
    });
  }

  // apre o chiude il dettaglio del tag
  toggle(progetto: ProjectInterface): void {
    this.expandedId.set(this.expandedId() === progetto.id ? null : progetto.id);
  }

  // compliance da 0 a 1 -> percentuale intera, troncata come nella colonna di Pentaho
  percentuale(compliance: number): number {
    return Math.floor(compliance * 100);
  }
}