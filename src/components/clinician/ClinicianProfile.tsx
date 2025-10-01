import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMediKey } from '@/contexts/MediKeyContext';
import { Shield, Stethoscope, Copy, Check, Activity, Users, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function ClinicianProfile() {
  const { state } = useMediKey();
  const { toast } = useToast();
  const [copiedPublic, setCopiedPublic] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Public key copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  if (!state.currentUser) return null;

  // Calculate clinician-specific stats
  const accessibleRecords = state.accessGrants.filter(
    grant => grant.clinicianId === state.currentUser.publicKey && grant.isActive
  );

  const verifiedPayments = state.payments.filter(
    payment => payment.userId === state.currentUser.publicKey && payment.status === 'paid'
  );

  const uniquePatients = new Set(accessibleRecords.map(grant => grant.patientId)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clinician Profile</h1>
        <p className="text-muted-foreground">
          Manage your clinical practice and patient access
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Clinical Identity</span>
            </CardTitle>
            <CardDescription>
              Your secure clinician identifier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant="default" className="mb-3 bg-blue-600">
                <Stethoscope className="h-3 w-3 mr-1" />
                Clinician Account
              </Badge>
              {state.currentUser.name && (
                <div className="space-y-1 mb-3">
                  <p className="text-sm font-medium">Clinician Name</p>
                  <p className="text-lg font-semibold">{state.currentUser.name}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">Clinician ID</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono break-all">
                    {state.currentUser.publicKey}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(state.currentUser.publicKey)}
                  >
                    {copiedPublic ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this ID with patients to request access to their records
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Practice Status</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Active Practice</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Practice Overview</span>
            </CardTitle>
            <CardDescription>
              Your clinical practice summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{uniquePatients}</div>
                <div className="text-xs text-muted-foreground">Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{accessibleRecords.length}</div>
                <div className="text-xs text-muted-foreground">Records</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Verification Payments</span>
                <span className="font-medium">{verifiedPayments.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Total Activities</span>
                <span className="font-medium">{state.activityLog.filter(log => log.userId === state.currentUser.publicKey).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common clinical workflow actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">Request Access</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Request patient record access
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">Verify Records</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Verify patient medical records
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Practice analytics dashboard
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>
            Clinical credentials and practice details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Practice Type</p>
                <p className="text-sm text-muted-foreground">General Practice</p>
              </div>
              <div>
                <p className="text-sm font-medium">Verification Level</p>
                <Badge variant="secondary">Basic Verification</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Network Status</p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Connected to MediKey Network</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Data Access</p>
                <p className="text-sm text-muted-foreground">Patient-Authorized Only</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}