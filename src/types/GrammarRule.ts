export interface GrammarRule {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  explanation: string;
  simpleSummary: string;
  level: number;
  difficulty: number;
  prerequisiteRules: string;
  appliesTo: string;
  exceptions: string;
  pattern: string;
  memoryAid: string;
  culturalContext: string;
}
