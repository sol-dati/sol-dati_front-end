export interface SonarRuleDTO {
  ruleKey: string;
  ruleName?: string;
  type?: string;
  severity?: string;
  language?: string;
  description?: string;
  issuesCount: number;
}