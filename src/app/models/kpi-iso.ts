// kpi di una categoria iso con valore ed esito dell'ultima analisi
export interface KpiIso {
  chiave: string;
  nome: string;
  descrizione: string | null;
  gruppo: 'METRICA' | 'REGOLA';
  tipoControllo: string | null;
  sogliaMin: number | null;
  sogliaMax: number | null;
  calcCompliance: boolean;
  valore: string | null;
  esito: 'ENTRO' | 'FUORI' | 'NP' | null;
}

// una colonna della scheda della categoria 
export interface ColonnaKpi {
  titolo: string;
  righe: KpiIso[];
}