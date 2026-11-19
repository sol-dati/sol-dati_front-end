import { Component, computed, input } from '@angular/core';
import { SonarResultDTO } from '../../../models/sonar-result-dto';

@Component({
  selector: 'app-sonar-result',
  standalone: false,
  styleUrl: './sonar-result.css',
  templateUrl: './sonar-result.html',
})
export class SonarResult {
  result = input.required<SonarResultDTO>();
 
  metriche = computed(() =>
    Object.entries(this.result().metrics ?? {}).map(([key, value]) => ({ key, value }))
  );
 
  formatMetricName(name: string): string {
    return name
      .replaceAll('_', ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}
