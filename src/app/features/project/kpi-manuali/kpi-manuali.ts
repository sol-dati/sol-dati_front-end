import { Component, inject, input, OnInit, output, signal } from '@angular/core';

import { KpiManualiService } from '../../../core/service/kpi-manuali-service';
import { KpiManuale } from '../../../models/kpi-manuale';

@Component({
  selector: 'app-kpi-manuali',
  standalone: false,
  styleUrl: './kpi-manuali.css',
  templateUrl: './kpi-manuali.html',
})
export class KpiManuali implements OnInit {

  private kpiManualiService = inject(KpiManualiService);

  projectName = input.required<string>();
  tag = input.required<string>();
  release = input<number | null>(null);
  sprint = input<number | null>(null);

  chiudi = output<void>();
  salvati = output<void>();

  kpi = signal<KpiManuale[]>([]);
  caricamento = signal(false);
  salvataggio = signal(false);
  errore = signal<string | null>(null);

  ngOnInit(): void {
    this.caricamento.set(true);
    this.kpiManualiService.list(this.projectName(), this.tag()).subscribe({
      next: resp => {
        this.kpi.set(resp);
        this.caricamento.set(false);
      },
      error: err => {
        this.errore.set(err?.error ?? 'Errore nella lettura dei KPI manuali');
        this.caricamento.set(false);
      },
    });
  }

  /* suggerimento nel campo: la soglia del piano qualità
  soglia(k: KpiManuale): string {
    if (k.sogliaMin != null && k.sogliaMax != null) {
      return k.sogliaMin === k.sogliaMax ? `= ${k.sogliaMax}` : `min ${k.sogliaMin} - max ${k.sogliaMax}`;
    }
    if (k.sogliaMax != null) {
      return `max ${k.sogliaMax}`;
    }
    if (k.sogliaMin != null) {
      return `min ${k.sogliaMin}`;
    }
    return '';
  }*/

  // aggiorna il valore della riga mentre l'utente scrive
  onValore(chiave: string, event: Event): void {
    const valore = (event.target as HTMLInputElement).value;
    this.kpi.update(righe => righe.map(k => k.chiave === chiave ? { ...k, valore } : k));
  }

  onSalva(): void {
    this.salvataggio.set(true);
    this.errore.set(null);

    this.kpiManualiService.salva({
      projectName: this.projectName(),
      tag: this.tag(),
      valori: this.kpi().map(k => ({ chiave: k.chiave, valore: k.valore })),
    }).subscribe({
      next: () => {
        this.salvataggio.set(false);
        this.salvati.emit();
      },
      error: err => {
        this.errore.set(err?.error ?? 'Errore nel salvataggio dei KPI manuali');
        this.salvataggio.set(false);
      },
    });
  }
}
