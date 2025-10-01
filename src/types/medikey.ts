// MediKey Application Types

export type UserRole = 'patient' | 'clinician';

export interface MediKeyUser {
  publicKey: string;
  privateKey: string;
  role: UserRole;
  name?: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  title: string;
  type: 'immunization' | 'lab_result' | 'prescription' | 'general';
  fileName: string;
  fileType: string;
  fileContent: string; // Base64 or JSON string
  uploadDate: Date;
  verified: boolean;
  metadata: {
    description?: string;
    tags?: string[];
  };
}

export interface AccessGrant {
  id: string;
  recordId: string;
  patientId: string;
  clinicianId: string;
  grantedAt: Date;
  revokedAt?: Date;
  isActive: boolean;
}

export interface LightningPayment {
  id: string;
  userId: string;
  amount: number;
  invoice: string;
  status: 'pending' | 'paid' | 'failed';
  type: 'record_verification' | 'upload_fee';
  recordId?: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'upload' | 'share' | 'revoke' | 'payment' | 'access_request';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AnalyticsData {
  totalRecords: number;
  totalShares: number;
  totalPayments: number;
  totalRevocations: number;
  recordsByType: Record<string, number>;
  activityHistory: Array<{
    date: string;
    uploads: number;
    shares: number;
    payments: number;
  }>;
}