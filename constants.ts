import { AnalysisResult, RiskLevel } from './types';

export const SAMPLE_LOGS = `
2023-10-27 08:00:01 INFO System started successfully.
2023-10-27 08:15:22 WARN Failed login attempt from IP 192.168.1.55 User: admin
2023-10-27 08:15:24 WARN Failed login attempt from IP 192.168.1.55 User: admin
2023-10-27 08:15:28 WARN Failed login attempt from IP 192.168.1.55 User: admin
2023-10-27 08:15:30 CRITICAL Brute force detected. Account locked. IP 192.168.1.55
2023-10-27 09:42:11 INFO Network scan detected from external IP 45.22.11.9
2023-10-27 09:42:15 CRITICAL Port 22 SSH connection established from 45.22.11.9
2023-10-27 09:45:00 INFO Large data transfer outbound to 45.22.11.9 (500MB)
2023-10-27 10:00:00 INFO Scheduled maintenance task completed.
`;

export const EMPTY_RESULT: AnalysisResult = {
  riskScore: 0,
  riskLevel: RiskLevel.LOW,
  summary: "No data analyzed yet. Please upload logs or use sample data.",
  anomalies: [],
  suggestions: [],
  threatDistribution: []
};