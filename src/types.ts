export type RiskLevel = 'high' | 'medium' | 'low';

export interface RiskItem {
  issue: string;
  explanation: string;
  severity: RiskLevel;
}

export interface ClauseAnalysis {
  risks: RiskItem[];
  missingTerms: string[];
  plainSummary: string;
  overallRisk: RiskLevel;
  recommendations: string[];
}

export interface HistoryItem {
  id: string;
  clause: string;
  analysis: ClauseAnalysis;
  timestamp: Date;
}
