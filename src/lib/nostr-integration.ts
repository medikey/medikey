import type { NostrEvent, UnsignedEvent } from '@nostrify/nostrify';
import type { 
  HealthRecord, 
  AccessGrant, 
  LightningPayment, 
  MediKeyUser 
} from '@/types/medikey';

// Custom MediKey event kinds
export const MEDIKEY_KINDS = {
  // User profile with healthcare-specific metadata
  HEALTHCARE_PROFILE: 30078, // NIP-78: Application-specific data
  
  // Health records using file metadata
  HEALTH_RECORD: 1063, // NIP-94: File Metadata
  
  // Access grants for record sharing
  ACCESS_GRANT: 30400, // Custom: Healthcare access grant (addressable)
  
  // Access revocation
  ACCESS_REVOCATION: 30401, // Custom: Healthcare access revocation (addressable)
  
  // Lightning payment for verification
  VERIFICATION_PAYMENT: 9735, // NIP-57: Zap (Lightning payment)
  
  // Activity logs
  ACTIVITY_LOG: 30079, // Custom: Healthcare activity log (addressable)
  
  // Healthcare data encryption wrapper
  ENCRYPTED_HEALTH_DATA: 30402, // Custom: Encrypted healthcare data (addressable)
} as const;

// NIP tags for healthcare data
export const HEALTHCARE_TAGS = {
  HEALTHCARE_TYPE: 'h', // Healthcare record type (immunization, lab_result, etc.)
  PATIENT_ID: 'patient', // Patient public key
  CLINICIAN_ID: 'clinician', // Clinician public key
  RECORD_ID: 'record', // Health record identifier
  MEDICAL_CATEGORY: 'm', // Medical category/specialty
  VERIFICATION_STATUS: 'v', // Verification status
  ACCESS_LEVEL: 'access', // Access level (read, write, verify)
  EXPIRY: 'expiry', // Access expiry timestamp
  HIPAA_COMPLIANT: 'hipaa', // HIPAA compliance marker
} as const;

/**
 * Convert a HealthRecord to a Nostr event (NIP-94: File Metadata)
 */
export function healthRecordToNostrEvent(
  record: HealthRecord,
  userPubkey: string
): UnsignedEvent {
  return {
    kind: MEDIKEY_KINDS.HEALTH_RECORD,
    pubkey: userPubkey,
    created_at: Math.floor(record.uploadDate.getTime() / 1000),
    content: record.metadata.description || record.title,
    tags: [
      ['d', record.id], // Unique identifier
      ['url', record.fileContent], // File URL/content
      ['m', record.fileType], // MIME type
      ['title', record.title],
      ['size', record.fileContent.length.toString()],
      [HEALTHCARE_TAGS.HEALTHCARE_TYPE, record.type],
      [HEALTHCARE_TAGS.PATIENT_ID, record.patientId],
      [HEALTHCARE_TAGS.VERIFICATION_STATUS, record.verified ? 'verified' : 'unverified'],
      [HEALTHCARE_TAGS.HIPAA_COMPLIANT, 'true'], // Mark as HIPAA compliant
      ['t', 'healthcare'], // General healthcare tag
      ['t', record.type], // Specific type tag
      ['alt', `Healthcare record: ${record.title}`], // NIP-31: Alt description
      ['client', 'MediKey', 'https://medikey.app'], // Client identification
      ...record.metadata.tags?.map(tag => ['t', tag]) || [],
    ],
  };
}

/**
 * Convert a Nostr event back to a HealthRecord
 */
export function nostrEventToHealthRecord(event: NostrEvent): HealthRecord | null {
  if (event.kind !== MEDIKEY_KINDS.HEALTH_RECORD) return null;

  const id = event.tags.find(([name]) => name === 'd')?.[1];
  const url = event.tags.find(([name]) => name === 'url')?.[1];
  const mimeType = event.tags.find(([name]) => name === 'm')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  const healthcareType = event.tags.find(([name]) => name === HEALTHCARE_TAGS.HEALTHCARE_TYPE)?.[1];
  const patientId = event.tags.find(([name]) => name === HEALTHCARE_TAGS.PATIENT_ID)?.[1];
  const verificationStatus = event.tags.find(([name]) => name === HEALTHCARE_TAGS.VERIFICATION_STATUS)?.[1];

  if (!id || !url || !title || !healthcareType || !patientId) return null;

  // Extract tags
  const tags = event.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value)
    .filter(tag => tag !== 'healthcare' && tag !== healthcareType);

  return {
    id,
    patientId,
    title,
    type: healthcareType as HealthRecord['type'],
    fileName: title, // Extract from title or URL
    fileType: mimeType || 'application/octet-stream',
    fileContent: url,
    uploadDate: new Date(event.created_at * 1000),
    verified: verificationStatus === 'verified',
    metadata: {
      description: event.content,
      tags,
    },
  };
}

/**
 * Convert an AccessGrant to a Nostr event
 */
export function accessGrantToNostrEvent(
  grant: AccessGrant,
  userPubkey: string
): UnsignedEvent {
  return {
    kind: MEDIKEY_KINDS.ACCESS_GRANT,
    pubkey: userPubkey,
    created_at: Math.floor(grant.grantedAt.getTime() / 1000),
    content: `Healthcare record access granted`,
    tags: [
      ['d', grant.id], // Unique identifier
      [HEALTHCARE_TAGS.RECORD_ID, grant.recordId],
      [HEALTHCARE_TAGS.PATIENT_ID, grant.patientId],
      [HEALTHCARE_TAGS.CLINICIAN_ID, grant.clinicianId],
      [HEALTHCARE_TAGS.ACCESS_LEVEL, 'read'],
      ['status', grant.isActive ? 'active' : 'revoked'],
      ...(grant.revokedAt ? [['revoked_at', Math.floor(grant.revokedAt.getTime() / 1000).toString()]] : []),
      [HEALTHCARE_TAGS.HIPAA_COMPLIANT, 'true'],
      ['t', 'healthcare'],
      ['t', 'access-grant'],
      ['alt', 'Healthcare record access grant'],
      ['client', 'MediKey', 'https://medikey.app'],
    ],
  };
}

/**
 * Convert an access revocation to a Nostr event
 */
export function accessRevocationToNostrEvent(
  grant: AccessGrant,
  userPubkey: string
): UnsignedEvent {
  return {
    kind: MEDIKEY_KINDS.ACCESS_REVOCATION,
    pubkey: userPubkey,
    created_at: Math.floor((grant.revokedAt || new Date()).getTime() / 1000),
    content: `Healthcare record access revoked`,
    tags: [
      ['d', `${grant.id}-revoke`], // Unique identifier for revocation
      ['e', grant.id], // Reference to original grant
      [HEALTHCARE_TAGS.RECORD_ID, grant.recordId],
      [HEALTHCARE_TAGS.PATIENT_ID, grant.patientId],
      [HEALTHCARE_TAGS.CLINICIAN_ID, grant.clinicianId],
      ['reason', 'access_revoked'],
      [HEALTHCARE_TAGS.HIPAA_COMPLIANT, 'true'],
      ['t', 'healthcare'],
      ['t', 'access-revocation'],
      ['alt', 'Healthcare record access revocation'],
      ['client', 'MediKey', 'https://medikey.app'],
    ],
  };
}

/**
 * Convert healthcare profile to Nostr event (NIP-78: Application-specific data)
 */
export function healthcareProfileToNostrEvent(
  user: MediKeyUser,
  additionalData: Record<string, any> = {}
): UnsignedEvent {
  return {
    kind: MEDIKEY_KINDS.HEALTHCARE_PROFILE,
    pubkey: user.publicKey,
    created_at: Math.floor(Date.now() / 1000),
    content: JSON.stringify({
      name: user.name,
      role: user.role,
      app: 'MediKey',
      version: '1.0.0',
      ...additionalData,
    }),
    tags: [
      ['d', 'medikey-profile'], // Application-specific identifier
      ['role', user.role],
      ['t', 'healthcare'],
      ['t', user.role],
      [HEALTHCARE_TAGS.HIPAA_COMPLIANT, 'true'],
      ['alt', `MediKey ${user.role} profile`],
      ['client', 'MediKey', 'https://medikey.app'],
    ],
  };
}

/**
 * Create an encrypted health data event (for sensitive information)
 */
export function createEncryptedHealthDataEvent(
  data: any,
  recipientPubkey: string,
  senderPubkey: string,
  encryptedContent: string
): UnsignedEvent {
  return {
    kind: MEDIKEY_KINDS.ENCRYPTED_HEALTH_DATA,
    pubkey: senderPubkey,
    created_at: Math.floor(Date.now() / 1000),
    content: encryptedContent, // NIP-44 encrypted content
    tags: [
      ['d', `encrypted-${Date.now()}`],
      ['p', recipientPubkey], // Recipient
      [HEALTHCARE_TAGS.HIPAA_COMPLIANT, 'true'],
      ['t', 'healthcare'],
      ['t', 'encrypted'],
      ['alt', 'Encrypted healthcare data'],
      ['client', 'MediKey', 'https://medikey.app'],
    ],
  };
}

/**
 * Validate if a Nostr event is a valid MediKey healthcare event
 */
export function isValidMediKeyEvent(event: NostrEvent): boolean {
  const validKinds = Object.values(MEDIKEY_KINDS);
  if (!validKinds.includes(event.kind)) return false;

  // Check for required healthcare tags
  const hasHealthcareTag = event.tags.some(([name, value]) => name === 't' && value === 'healthcare');
  const hasClientTag = event.tags.some(([name, value]) => name === 'client' && value === 'MediKey');
  const hasAltTag = event.tags.some(([name]) => name === 'alt');

  return hasHealthcareTag && hasClientTag && hasAltTag;
}

/**
 * Generate filter for querying MediKey events
 */
export function getMediKeyEventFilter(
  userPubkey?: string,
  kinds?: number[],
  additionalFilters: Record<string, any> = {}
) {
  return {
    kinds: kinds || Object.values(MEDIKEY_KINDS),
    ...(userPubkey && { authors: [userPubkey] }),
    '#t': ['healthcare'],
    '#client': ['MediKey'],
    ...additionalFilters,
  };
}