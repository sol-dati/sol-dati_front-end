// KPI manuale del catalogo con l'eventuale valore già inserito per il tag
export interface KpiManuale {
  chiave: string;
  nome: string;
  descrizione: string | null;
  isoCode: string;
  sogliaMin: number | null;
  sogliaMax: number | null;
  calcCompliance: boolean;
  valore: string | null;
}

// valori da salvare per un tag: i vuoti non vengono salvati
export interface KpiManualiReq {
  projectName: string;
  tag: string;
  valori: { chiave: string; valore: string | null }[];
}
