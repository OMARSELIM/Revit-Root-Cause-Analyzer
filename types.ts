export interface WarningGroup {
  message: string;
  count: number;
  originalIds?: string[];
}

export enum Severity {
  CRITICAL = 'Critical',
  MODERATE = 'Moderate',
  LOW = 'Low'
}

export interface RootCause {
  title: string;
  severity: Severity;
  description: string;
  radicalSolution: string;
  workflowImpact: string;
  affectedWarningTypes: string[];
}

export interface AnalysisResult {
  rootCauses: RootCause[];
  totalWarnings: number;
  analyzedAt: string;
}
