import { IsoCodeDTO } from "./iso-code-dto";
import { SonarRuleDTO } from "./sonar-rule-dto";

export interface SonarResultDTO {
  projectKey?: string;
  metrics: Record<string, string>;
  rules: SonarRuleDTO[];
  iso: IsoCodeDTO[];
}

