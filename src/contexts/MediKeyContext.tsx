import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { 
  MediKeyUser, 
  HealthRecord, 
  AccessGrant, 
  LightningPayment, 
  ActivityLog, 
  AnalyticsData,
  UserRole 
} from '@/types/medikey';

interface MediKeyState {
  currentUser: MediKeyUser | null;
  records: HealthRecord[];
  accessGrants: AccessGrant[];
  payments: LightningPayment[];
  activityLog: ActivityLog[];
  analytics: AnalyticsData;
}

type MediKeyAction =
  | { type: 'SET_USER'; payload: MediKeyUser | null }
  | { type: 'ADD_RECORD'; payload: HealthRecord }
  | { type: 'ADD_ACCESS_GRANT'; payload: AccessGrant }
  | { type: 'REVOKE_ACCESS'; payload: { grantId: string } }
  | { type: 'ADD_PAYMENT'; payload: LightningPayment }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; status: LightningPayment['status']; paidAt?: Date } }
  | { type: 'ADD_ACTIVITY'; payload: ActivityLog }
  | { type: 'UPDATE_ANALYTICS' }
  | { type: 'LOAD_STATE'; payload: Partial<MediKeyState> };

const initialState: MediKeyState = {
  currentUser: null,
  records: [],
  accessGrants: [],
  payments: [],
  activityLog: [],
  analytics: {
    totalRecords: 0,
    totalShares: 0,
    totalPayments: 0,
    totalRevocations: 0,
    recordsByType: {},
    activityHistory: []
  }
};

function calculateAnalytics(state: MediKeyState): AnalyticsData {
  const activeGrants = state.accessGrants.filter(g => g.isActive);
  const paidPayments = state.payments.filter(p => p.status === 'paid');
  const revocations = state.accessGrants.filter(g => g.revokedAt);

  const recordsByType = state.records.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Generate activity history for last 7 days
  const now = new Date();
  const activityHistory = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayActivities = state.activityLog.filter(log => 
      log.timestamp.toISOString().split('T')[0] === dateStr
    );

    return {
      date: dateStr,
      uploads: dayActivities.filter(a => a.action === 'upload').length,
      shares: dayActivities.filter(a => a.action === 'share').length,
      payments: dayActivities.filter(a => a.action === 'payment').length,
    };
  }).reverse();

  return {
    totalRecords: state.records.length,
    totalShares: activeGrants.length,
    totalPayments: paidPayments.length,
    totalRevocations: revocations.length,
    recordsByType,
    activityHistory
  };
}

function mediKeyReducer(state: MediKeyState, action: MediKeyAction): MediKeyState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_RECORD':
      return { 
        ...state, 
        records: [...state.records, action.payload] 
      };
    
    case 'ADD_ACCESS_GRANT':
      return { 
        ...state, 
        accessGrants: [...state.accessGrants, action.payload] 
      };
    
    case 'REVOKE_ACCESS':
      return {
        ...state,
        accessGrants: state.accessGrants.map(grant =>
          grant.id === action.payload.grantId
            ? { ...grant, isActive: false, revokedAt: new Date() }
            : grant
        )
      };
    
    case 'ADD_PAYMENT':
      return { 
        ...state, 
        payments: [...state.payments, action.payload] 
      };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id
            ? { 
                ...payment, 
                status: action.payload.status, 
                ...(action.payload.paidAt && { paidAt: action.payload.paidAt })
              }
            : payment
        )
      };
    
    case 'ADD_ACTIVITY':
      return { 
        ...state, 
        activityLog: [...state.activityLog, action.payload] 
      };
    
    case 'UPDATE_ANALYTICS':
      return { 
        ...state, 
        analytics: calculateAnalytics(state) 
      };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const MediKeyContext = createContext<{
  state: MediKeyState;
  dispatch: React.Dispatch<MediKeyAction>;
} | null>(null);

interface MediKeyProviderProps {
  children: React.ReactNode;
}

export function MediKeyProvider({ children }: MediKeyProviderProps) {
  const [state, dispatch] = useReducer(mediKeyReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('medikey-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        if (parsedState.records) {
          parsedState.records = parsedState.records.map((record: any) => ({
            ...record,
            uploadDate: new Date(record.uploadDate)
          }));
        }
        if (parsedState.accessGrants) {
          parsedState.accessGrants = parsedState.accessGrants.map((grant: any) => ({
            ...grant,
            grantedAt: new Date(grant.grantedAt),
            ...(grant.revokedAt && { revokedAt: new Date(grant.revokedAt) })
          }));
        }
        if (parsedState.payments) {
          parsedState.payments = parsedState.payments.map((payment: any) => ({
            ...payment,
            createdAt: new Date(payment.createdAt),
            ...(payment.paidAt && { paidAt: new Date(payment.paidAt) })
          }));
        }
        if (parsedState.activityLog) {
          parsedState.activityLog = parsedState.activityLog.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }));
        }
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load MediKey state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medikey-state', JSON.stringify(state));
    // Recalculate analytics whenever state changes
    dispatch({ type: 'UPDATE_ANALYTICS' });
  }, [state.records, state.accessGrants, state.payments, state.activityLog]);

  return (
    <MediKeyContext.Provider value={{ state, dispatch }}>
      {children}
    </MediKeyContext.Provider>
  );
}

export function useMediKey() {
  const context = useContext(MediKeyContext);
  if (!context) {
    throw new Error('useMediKey must be used within a MediKeyProvider');
  }
  return context;
}

// Utility functions for generating mock data
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  // Mock key generation - in real app this would use proper cryptography
  const publicKey = 'pk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const privateKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return { publicKey, privateKey };
}

export function generateLightningInvoice(amount: number): string {
  // Mock Lightning invoice generation
  return `lnbc${amount}u1p${Math.random().toString(36).substring(2, 15)}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}