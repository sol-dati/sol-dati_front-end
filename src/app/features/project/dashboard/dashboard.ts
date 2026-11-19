import { Component, computed, input, output } from '@angular/core';
import { TagRow } from '../../../models/tag-row';
import { SonarResultDTO } from '../../../models/sonar-result-dto';
import { StatoAnalisi } from '../../../models/stato-analisi';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  row = input.required<TagRow>();
  sonarResult = input<SonarResultDTO | null>(null);
  loading = input(false);
  errore = input<string | null>(null);
  avviaSq = output<void>();
  kpiManuali = output<void>();
  // nome del progetto per aprire solo le sue analisi
  progetto = input<string>('');

  // analisi del tag in corso
  analisiInCorso = computed(() =>
    this.loading() || this.row().statoId === StatoAnalisi.IN_CORSO
  );
}