import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMediKey, generateId } from '@/contexts/MediKeyContext';
import { usePublishAccessGrant, usePublishAccessRevocation } from '@/hooks/useMediKeyNostr';
import { useToast } from '@/hooks/useToast';
import {
  Share2,
  UserCheck,
  FileText,
  Shield,
  Calendar,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import type { HealthRecord } from '@/types/medikey';

export function ShareAccess() {
  const { state, dispatch } = useMediKey();
  const { toast } = useToast();
  const { mutate: publishGrant } = usePublishAccessGrant();
  const { mutate: publishRevocation } = usePublishAccessRevocation();

  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [clinicianPublicKey, setClinicianPublicKey] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const userRecords = state.records.filter(record =>
    record.patientId === state.currentUser?.publicKey
  );

  const activeGrants = state.accessGrants.filter(grant => grant.isActive);

  const handleShareAccess = async () => {
    if (!selectedRecordId || !clinicianPublicKey.trim() || !state.currentUser) return;

    // Validate clinician key format
    if (!clinicianPublicKey.startsWith('pk_')) {
      toast({
        title: 'Invalid Key Format',
        description: 'Clinician public key must start with "pk_"',
        variant: 'destructive',
      });
      return;
    }

    // Check if already shared with this clinician
    const existingGrant = state.accessGrants.find(
      grant => grant.recordId === selectedRecordId &&
               grant.clinicianId === clinicianPublicKey &&
               grant.isActive
    );

    if (existingGrant) {
      toast({
        title: 'Already Shared',
        description: 'This record is already shared with this clinician.',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);

    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const grant = {
        id: generateId(),
        recordId: selectedRecordId,
        patientId: state.currentUser.publicKey,
        clinicianId: clinicianPublicKey,
        grantedAt: new Date(),
        isActive: true
      };

      dispatch({ type: 'ADD_ACCESS_GRANT', payload: grant });

      // Publish to Nostr
      try {
        publishGrant(grant);
      } catch (nostrError) {
        console.warn('Failed to publish access grant to Nostr:', nostrError);
      }

      // Add activity log
      const record = userRecords.find(r => r.id === selectedRecordId);
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          userId: state.currentUser.publicKey,
          action: 'share',
          description: `Granted access to "${record?.title}" to clinician ${clinicianPublicKey.substring(0, 12)}...`,
          timestamp: new Date(),
          metadata: { recordId: selectedRecordId, clinicianId: clinicianPublicKey }
        }
      });

      toast({
        title: 'Access Granted',
        description: 'The clinician now has access to this record.',
      });

      // Reset form
      setSelectedRecordId('');
      setClinicianPublicKey('');

    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'There was an error granting access.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevokeAccess = async (grantId: string) => {
    const grant = state.accessGrants.find(g => g.id === grantId);
    if (!grant || !state.currentUser) return;

    dispatch({ type: 'REVOKE_ACCESS', payload: { grantId } });

    // Publish revocation to Nostr
    try {
      publishRevocation(grant);
    } catch (nostrError) {
      console.warn('Failed to publish access revocation to Nostr:', nostrError);
    }

    // Add activity log
    const record = userRecords.find(r => r.id === grant.recordId);
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: generateId(),
        userId: state.currentUser.publicKey,
        action: 'revoke',
        description: `Revoked access to "${record?.title}" from clinician ${grant.clinicianId.substring(0, 12)}...`,
        timestamp: new Date(),
        metadata: { recordId: grant.recordId, clinicianId: grant.clinicianId }
      }
    });

    toast({
      title: 'Access Revoked',
      description: 'The clinician no longer has access to this record.',
    });
  };

  const getRecordTitle = (recordId: string) => {
    const record = userRecords.find(r => r.id === recordId);
    return record?.title || 'Unknown Record';
  };

  const getRecordType = (recordId: string) => {
    const record = userRecords.find(r => r.id === recordId);
    return record?.type || 'general';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Share Access</h1>
        <p className="text-muted-foreground">
          Grant clinicians access to specific health records
        </p>
      </div>

      {/* Grant New Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Grant Access</span>
          </CardTitle>
          <CardDescription>
            Select a record and enter the clinician's public key to grant access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No records available to share. Upload some records first.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="record-select">Select Record</Label>
                <Select value={selectedRecordId} onValueChange={setSelectedRecordId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a record to share" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRecords.map((record) => (
                      <SelectItem key={record.id} value={record.id}>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{record.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {record.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinician-key">Clinician Public Key</Label>
                <Input
                  id="clinician-key"
                  placeholder="pk_..."
                  value={clinicianPublicKey}
                  onChange={(e) => setClinicianPublicKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the clinician's public key starting with "pk_"
                </p>
              </div>

              <Button
                onClick={handleShareAccess}
                disabled={!selectedRecordId || !clinicianPublicKey.trim() || isSharing}
                className="w-full"
              >
                {isSharing ? 'Granting Access...' : 'Grant Access'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Active Grants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Active Access Grants</span>
          </CardTitle>
          <CardDescription>
            Manage who has access to your health records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeGrants.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No active access grants. Your records are private.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGrants.map((grant) => (
                <div key={grant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium">{getRecordTitle(grant.recordId)}</h4>
                        <p className="text-sm text-muted-foreground">
                          Clinician: {grant.clinicianId.substring(0, 20)}...
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getRecordType(grant.recordId)}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Granted {format(grant.grantedAt, 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <span>Revoke Access?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will immediately revoke the clinician's access to "{getRecordTitle(grant.recordId)}".
                          This action cannot be undone, but you can grant access again later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRevokeAccess(grant.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Revoke Access
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}