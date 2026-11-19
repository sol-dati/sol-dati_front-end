// compliance di una categoria iso (quote da 0 a 1)
export interface IsoSintesi {
  codice: string;
  descrizione: string;
  kpiCompliance: number;
  entro: number;
  fuori: number;
  np: number;
}