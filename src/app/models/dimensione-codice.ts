// righe di codice di un linguaggio
export interface LinguaggioLoc {
  linguaggio: string;
  righe: number;
  quota: number;
}

// dimensione del codice nell'ultima analisi
export interface DimensioneCodice {
  numeroFile: number;
  righeCodice: number;
  linguaggi: LinguaggioLoc[];
}