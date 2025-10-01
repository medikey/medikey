import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useMediKey } from '@/contexts/MediKeyContext';
import {
  healthRecordToNostrEvent,
  accessGrantToNostrEvent,
  accessRevocationToNostrEvent,
  healthcareProfileToNostrEvent,
  nostrEventToHealthRecord,
  getMediKeyEventFilter,
  isValidMediKeyEvent,
  MEDIKEY_KINDS
} from '@/lib/nostr-integration';
import type { HealthRecord, AccessGrant } from '@/types/medikey';

/**
 * Publish a health record to Nostr
 */
export function usePublishHealthRecord() {
  const { mutate: publishEvent } = useNostrPublish();
  const { state } = useMediKey();

  return useMutation({
    mutationFn: async (record: HealthRecord) => {
      if (!state.currentUser) throw new Error('User not authenticated');

      const event = healthRecordToNostrEvent(record, state.currentUser.publicKey);
      publishEvent(event);
      return event;
    },
  });
}

/**
 * Query health records from Nostr
 */
export function useHealthRecords(patientPubkey?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['health-records', patientPubkey],
    queryFn: async ({ signal }) => {
      const filter = getMediKeyEventFilter(patientPubkey, [MEDIKEY_KINDS.HEALTH_RECORD]);
      const events = await nostr.query([filter], {
        signal: AbortSignal.any([signal, AbortSignal.timeout(5000)])
      });

      return events
        .filter(isValidMediKeyEvent)
        .map(nostrEventToHealthRecord)
        .filter((record): record is HealthRecord => record !== null);
    },
    enabled: !!patientPubkey,
  });
}

/**
 * Publish an access grant to Nostr
 */
export function usePublishAccessGrant() {
  const { mutate: publishEvent } = useNostrPublish();
  const { state } = useMediKey();

  return useMutation({
    mutationFn: async (grant: AccessGrant) => {
      if (!state.currentUser) throw new Error('User not authenticated');

      const event = accessGrantToNostrEvent(grant, state.currentUser.publicKey);
      publishEvent(event);
      return event;
    },
  });
}

/**
 * Publish an access revocation to Nostr
 */
export function usePublishAccessRevocation() {
  const { mutate: publishEvent } = useNostrPublish();
  const { state } = useMediKey();

  return useMutation({
    mutationFn: async (grant: AccessGrant) => {
      if (!state.currentUser) throw new Error('User not authenticated');

      const event = accessRevocationToNostrEvent(grant, state.currentUser.publicKey);
      publishEvent(event);
      return event;
    },
  });
}

/**
 * Query access grants from Nostr
 */
export function useAccessGrants(userPubkey?: string, userRole?: 'patient' | 'clinician') {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['access-grants', userPubkey, userRole],
    queryFn: async ({ signal }) => {
      const filter = getMediKeyEventFilter(undefined, [MEDIKEY_KINDS.ACCESS_GRANT, MEDIKEY_KINDS.ACCESS_REVOCATION]);

      // Add role-specific filters
      if (userPubkey && userRole === 'patient') {
        filter['#patient'] = [userPubkey];
      } else if (userPubkey && userRole === 'clinician') {
        filter['#clinician'] = [userPubkey];
      }

      const events = await nostr.query([filter], {
        signal: AbortSignal.any([signal, AbortSignal.timeout(5000)])
      });

      return events.filter(isValidMediKeyEvent);
    },
    enabled: !!userPubkey,
  });
}

/**
 * Publish healthcare profile to Nostr
 */
export function usePublishHealthcareProfile() {
  const { mutate: publishEvent } = useNostrPublish();

  return useMutation({
    mutationFn: async ({ user, additionalData }: { user: any; additionalData?: Record<string, any> }) => {
      const event = healthcareProfileToNostrEvent(user, additionalData);
      publishEvent(event);
      return event;
    },
  });
}

/**
 * Sync local state with Nostr events
 */
export function useSyncWithNostr() {
  const { state, dispatch } = useMediKey();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!state.currentUser) throw new Error('User not authenticated');

      // Invalidate all queries to force refresh from Nostr
      await queryClient.invalidateQueries({ queryKey: ['health-records'] });
      await queryClient.invalidateQueries({ queryKey: ['access-grants'] });

      return 'Sync completed';
    },
  });
}