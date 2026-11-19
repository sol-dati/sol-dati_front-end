import { SonarRuleDTO } from "./sonar-rule-dto";

export interface IsoCodeDTO {
  isoCode: string;
  descrizione?: string;
  metrics: Record<string, string>;
  rules: SonarRuleDTO[];
}