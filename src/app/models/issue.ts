// kpi con severità blocker/critical nell'ultima analisi
export interface IssueKpi {
  isoCodice: string;
  isoDescrizione: string;
  chiave: string;
  nome: string;
  valore: string | null;
  sogliaMin: number | null;
  sogliaMax: number | null;
  calcCompliance: boolean;
  esito: 'ENTRO' | 'FUORI' | 'NP' | null;
}

// kpi violati di una categoria ISO
export interface IssueIso {
  codice: string;
  descrizione: string;
  violati: number;
  quota: number;
}

// blocco di una severità
export interface IssueSezione {
  severita: string;
  totaleViolati: number;
  violatiPerIso: IssueIso[];
  kpi: IssueKpi[];
}