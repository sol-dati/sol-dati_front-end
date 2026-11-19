import { Component, computed, inject, input, OnInit, signal } from '@angular/core';

import { DashboardService } from '../../../core/service/dashboard-service';
import { DimensioneCodice } from '../../../models/dimensione-codice';
import { IsoSintesi } from '../../../models/iso-sintesi';
import { IssueSezione } from '../../../models/issue';
import { ColonnaKpi, KpiIso } from '../../../models/kpi-iso';

// sezioni dell'ultima analisi di un tag
@Component({
  selector: 'app-analisi-dettaglio',
  standalone: false,
  styleUrl: './analisi-dettaglio.css',
  templateUrl: './analisi-dettaglio.html',
})
export class AnalisiDettaglio implements OnInit {

  private dashboardService = inject(DashboardService);

  // oltre questo numero di KPI la scheda va su due colonne
  private static readonly KPI_PER_DUE_COLONNE = 15;

  // codice ISO della Manutenibilità (iso25010code): la sua scheda mostra anche la dimensione del codice
  protected readonly codiceManutenibilita = 'M';

  projectId = input.required<number>();

  // 'SINTESI', 'ISSUE' oppure il codice della categoria ISO
  sezione = signal('SINTESI');

  sintesi = signal<IsoSintesi[]>([]);
  kpi = signal(new Map<string, KpiIso[]>());
  issue = signal<IssueSezione[] | null>(null);
  dimensione = signal<DimensioneCodice | null>(null);

  caricamento = signal(false);
  errore = signal<string | null>(null);

  // colonne della scheda aperta: Metriche | Regole se ci sono tutte e due, altrimenti lista divisa a metà
  colonneSezione = computed<ColonnaKpi[]>(() => {
    const kpi = this.kpi().get(this.sezione()) ?? [];

    if (kpi.length <= AnalisiDettaglio.KPI_PER_DUE_COLONNE) {
      return [{ titolo: '', righe: kpi }];
    }

    const metriche = kpi.filter(k => k.gruppo === 'METRICA');
    const regole = kpi.filter(k => k.gruppo === 'REGOLA');
    if (metriche.length && regole.length) {
      return [{ titolo: 'Metriche', righe: metriche }, { titolo: 'Regole', righe: regole }];
    }

    const meta = Math.ceil(kpi.length / 2);
    return [{ titolo: '', righe: kpi.slice(0, meta) }, { titolo: '', righe: kpi.slice(meta) }];
  });

  ngOnInit(): void {
    this.caricamento.set(true);
    this.dashboardService.sintesi(this.projectId()).subscribe({
      next: resp => {
        this.sintesi.set(resp);
        this.caricamento.set(false);
      },
      error: err => {
        this.errore.set(err?.error ?? 'Errore nel caricamento della sintesi');
        this.caricamento.set(false);
      },
    });

    // le issue servono già nella Sintesi (conteggi Blocker / Critical) e poi nella scheda Issue
    this.caricaIssue();
  }

  // apre una scheda; i dati di ogni scheda si caricano solo la prima volta
  apri(sezione: string): void {
    this.sezione.set(sezione);
    this.errore.set(null);

    if (sezione === 'SINTESI') {
      return;
    }
    if (sezione === 'ISSUE') {
      this.caricaIssue();
      return;
    }

    if (sezione === this.codiceManutenibilita && this.dimensione() === null) {
      this.caricaDimensione();
    }

    if (!this.kpi().has(sezione)) {
      this.caricaKpi(sezione);
    }
  }

  descrizioneSezione(): string {
    return this.sintesi().find(s => s.codice === this.sezione())?.descrizione ?? '';
  }

  // quota da 0 a 1 -> percentuale con due decimali (come "#0.00%" di Pentaho)
  percentuale(quota: number): string {
    return (quota * 100).toFixed(2);
  }

  // numero con il separatore delle migliaia all'italiana (12.345)
  numero(n: number): string {
    return n.toLocaleString('it-IT');
  }

  // classe del colore in base all'esito calcolato dal backend
  classeEsito(esito: string | null): string {
    switch (esito) {
      case 'ENTRO': return 'ok';
      case 'FUORI': return 'ko';
      default: return 'nd';
    }
  }

  // testo del tooltip sul valore: spiega il colore del badge
  descrizioneEsito(esito: string | null): string {
    switch (esito) {
      case 'ENTRO': return 'Valore entro le soglie del piano qualità';
      case 'FUORI': return 'Valore fuori dalle soglie del piano qualità';
      case 'NP': return 'Nessuna soglia definita nel piano qualità';
      default: return 'KPI non misurato in questa analisi';
    }
  }

  // valore esatto come salvato nel DB; "%" se la soglia max è 100, testo fisso se assente o non numerico
  valoreFormattato(k: { valore: string | null; sogliaMax: number | null }): string {
    const valore = k.valore?.trim();
    if (!valore || Number.isNaN(Number(valore.replace(',', '.')))) {
      return 'Valore non presente';
    }
    return valore + (k.sogliaMax === 100 ? '%' : '');
  }

  private caricaKpi(isoCode: string): void {
    this.caricamento.set(true);
    this.dashboardService.kpiIso(this.projectId(), isoCode).subscribe({
      next: resp => {
        this.kpi.update(m => new Map(m).set(isoCode, resp));
        this.caricamento.set(false);
      },
      error: err => {
        this.errore.set(err?.error ?? 'Errore nel caricamento dei KPI');
        this.caricamento.set(false);
      },
    });
  }

  // il riquadro si carica in parallelo ai KPI e compare quando arriva
  private caricaDimensione(): void {
    this.dashboardService.dimensioneCodice(this.projectId()).subscribe({
      next: resp => this.dimensione.set(resp),
      error: err => this.errore.set(err?.error ?? 'Errore nel caricamento della dimensione del codice'),
    });
  }

  // parte insieme alla sintesi: non usa "caricamento", altrimenti chi finisce prima toglie la scritta all'altro
  private caricaIssue(): void {
    if (this.issue() !== null) {
      return;
    }
    this.dashboardService.issue(this.projectId()).subscribe({
      next: resp => this.issue.set(resp),
      error: err => this.errore.set(err?.error ?? 'Errore nel caricamento delle issue'),
    });
  }
}