import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMediKey, generateId } from '@/contexts/MediKeyContext';
import { useToast } from '@/hooks/useToast';
import { 
  Search, 
  UserCheck, 
  FileText, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';

export function RequestAccess() {
  const { state, dispatch } = useMediKey();
  const { toast } = useToast();
  
  const [patientPublicKey, setPatientPublicKey] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    found: boolean;
    records: any[];
    hasAccess: boolean;
  } | null>(null);

  const handleSearchPatient = async () => {
    if (!patientPublicKey.trim()) return;

    // Validate patient key format
    if (!patientPublicKey.startsWith('pk_')) {
      toast({
        title: 'Invalid Key Format',
        description: 'Patient public key must start with "pk_"',
        variant: 'destructive',
      });
      return;
    }

    setIsRequesting(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if patient exists (has any records)
      const patientRecords = state.records.filter(record => record.patientId === patientPublicKey);
      
      // Check if clinician already has access
      const existingAccess = state.accessGrants.filter(
        grant => grant.patientId === patientPublicKey && 
                 grant.clinicianId === state.currentUser?.publicKey &&
                 grant.isActive
      );

      setSearchResults({
        found: patientRecords.length > 0,
        records: patientRecords,
        hasAccess: existingAccess.length > 0
      });

    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'There was an error searching for the patient.',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!patientPublicKey.trim() || !requestReason.trim() || !state.currentUser) return;

    setIsRequesting(true);

    try {
      // Simulate request processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add activity log for the request
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          userId: state.currentUser.publicKey,
          action: 'access_request',
          description: `Requested access to patient records: ${patientPublicKey.substring(0, 12)}...`,
          timestamp: new Date(),
          metadata: { 
            patientId: patientPublicKey, 
            reason: requestReason 
          }
        }
      });

      toast({
        title: 'Access Request Sent',
        description: 'Your request has been sent to the patient for approval.',
      });

      // Reset form
      setRequestReason('');
      setSearchResults(null);

    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'There was an error sending your access request.',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  // Get accessible records for this clinician
  const accessibleGrants = state.accessGrants.filter(
    grant => grant.clinicianId === state.currentUser?.publicKey && grant.isActive
  );

  const accessibleRecords = state.records.filter(record =>
    accessibleGrants.some(grant => grant.recordId === record.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Request Patient Access</h1>
        <p className="text-muted-foreground">
          Search for patients and request access to their health records
        </p>
      </div>

      {/* Search Patient */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Patient</span>
          </CardTitle>
          <CardDescription>
            Enter a patient's public key to search for their records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-key">Patient Public Key</Label>
            <div className="flex space-x-2">
              <Input
                id="patient-key"
                placeholder="pk_..."
                value={patientPublicKey}
                onChange={(e) => {
                  setPatientPublicKey(e.target.value);
                  setSearchResults(null);
                }}
                className="font-mono"
              />
              <Button
                onClick={handleSearchPatient}
                disabled={!patientPublicKey.trim() || isRequesting}
              >
                {isRequesting ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="space-y-3">
              {searchResults.found ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Patient found with {searchResults.records.length} record{searchResults.records.length !== 1 ? 's' : ''}.
                    {searchResults.hasAccess && ' You already have access to some records.'}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    No records found for this patient key. The patient may not have uploaded any records yet.
                  </AlertDescription>
                </Alert>
              )}

              {searchResults.found && !searchResults.hasAccess && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="request-reason">Reason for Access Request</Label>
                    <Textarea
                      id="request-reason"
                      placeholder="Please explain why you need access to this patient's records..."
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleRequestAccess}
                    disabled={!requestReason.trim() || isRequesting}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isRequesting ? 'Sending Request...' : 'Send Access Request'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Current Patient Access</span>
          </CardTitle>
          <CardDescription>
            Records you currently have permission to view
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accessibleRecords.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No patient records accessible. Request access to view patient data.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {accessibleRecords.map((record) => {
                const grant = accessibleGrants.find(g => g.recordId === record.id);
                return (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{record.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Patient: {record.patientId.substring(0, 20)}...
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {record.type}
                          </Badge>
                          {record.verified && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Access granted</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}