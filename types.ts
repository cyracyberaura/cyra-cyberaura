
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum SafetyStatus {
  SAFE = 'Safe',
  SUSPICIOUS = 'Suspicious',
  MALICIOUS = 'Malicious'
}

export interface ScanResult {
  status: SafetyStatus;
  riskLevel: RiskLevel;
  threatType: string;
  explanation: string;
  recommendations: string[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  isModerated: boolean;
}

export interface AppActivity {
  name: string;
  permissionCount: number;
  lastActive: string;
  riskScore: number;
  isUnknownSource: boolean;
}
