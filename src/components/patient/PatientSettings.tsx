import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMediKey, generateKeyPair } from '@/contexts/MediKeyContext';
import { Shield, AlertTriangle, RefreshCw, Trash2, Settings, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function PatientSettings() {
  const { state, dispatch } = useMediKey();
  const { toast } = useToast();

  const handleRegenerateKeys = () => {
    const { publicKey, privateKey } = generateKeyPair();
    
    dispatch({
      type: 'SET_USER',
      payload: {
        ...state.currentUser!,
        publicKey,
        privateKey
      }
    });

    // Add activity log
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: Math.random().toString(36),
        userId: publicKey,
        action: 'access_request',
        description: 'Regenerated cryptographic keys',
        timestamp: new Date()
      }
    });

    toast({
      title: 'Keys Regenerated',
      description: 'Your new cryptographic keys have been generated successfully.',
    });
  };

  const handleClearAllData = () => {
    // This would clear all user data in a real implementation
    toast({
      title: 'Data Cleared',
      description: 'All your data has been removed from local storage.',
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      user: state.currentUser,
      records: state.records.filter(r => r.patientId === state.currentUser?.publicKey),
      accessGrants: state.accessGrants.filter(g => g.patientId === state.currentUser?.publicKey),
      payments: state.payments.filter(p => p.userId === state.currentUser?.publicKey),
      activityLog: state.activityLog.filter(l => l.userId === state.currentUser?.publicKey)
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medikey-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data Exported',
      description: 'Your MediKey data has been downloaded.',
    });
  };

  if (!state.currentUser) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Account Information */}
      <div className="crypto-card rounded-3xl p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Account Information</h3>
          </div>
          <p className="text-muted-foreground">
            Your basic account details and preferences
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Account Name</label>
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                <p className="font-medium">{state.currentUser.name || 'No name set'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Account Type</label>
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                <Badge variant="secondary" className="capitalize">
                  {state.currentUser.role}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Public Key ID</label>
            <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
              <p className="font-mono text-sm break-all">{state.currentUser.publicKey}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="crypto-card rounded-3xl p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-xl">
              <Download className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Data Management</h3>
          </div>
          <p className="text-muted-foreground">
            Export and manage your healthcare data
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
            <div>
              <h4 className="font-medium mb-1">Export Data</h4>
              <p className="text-sm text-muted-foreground">
                Download all your records, shares, and activity history
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportData}
              className="h-10 px-4 rounded-xl border-border/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
            <div>
              <h4 className="font-medium mb-1">Import Data</h4>
              <p className="text-sm text-muted-foreground">
                Import previously exported MediKey data
              </p>
            </div>
            <Button
              variant="outline"
              disabled
              className="h-10 px-4 rounded-xl border-border/50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border-2 border-red-200 bg-red-50/50 p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-900">Danger Zone</h3>
          </div>
          <p className="text-red-700">
            Irreversible and destructive actions for your account
          </p>
        </div>

        <div className="space-y-4">
          {/* Regenerate Keys */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-white">
            <div>
              <h4 className="font-medium text-red-900 mb-1">Regenerate Cryptographic Keys</h4>
              <p className="text-sm text-red-700">
                Generate new keys and invalidate current ones. This will revoke all existing access grants.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-10 px-4 rounded-xl">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span>Regenerate Cryptographic Keys?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will generate new public and private keys. Your current keys will be invalidated and you will lose access to previously shared records. All existing access grants will be revoked. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRegenerateKeys}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Regenerate Keys
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-white">
            <div>
              <h4 className="font-medium text-red-900 mb-1">Clear All Data</h4>
              <p className="text-sm text-red-700">
                Remove all records, activity history, and account data from local storage.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-10 px-4 rounded-xl">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span>Clear All Data?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your records, activity history, access grants, and payment data from local storage. This action cannot be undone. Make sure to export your data first if you want to keep it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}