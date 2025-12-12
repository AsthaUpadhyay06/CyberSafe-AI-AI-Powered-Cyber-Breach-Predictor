export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Anomaly {
  id: string;
  timestamp: string;
  eventType: string;
  severity: RiskLevel;
  description: string;
  sourceIp?: string;
}

export interface Suggestion {
  id: string;
  action: string;
  reason: string;
  priority: 'Immediate' | 'High' | 'Normal';
  type: 'Network' | 'System' | 'Policy';
}

export interface AnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  summary: string;
  anomalies: Anomaly[];
  suggestions: Suggestion[];
  threatDistribution: { name: string; value: number }[]; // For charts
}

export type TabView = 'upload' | 'dashboard' | 'actions' | 'reports';