import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMediKey } from '@/contexts/MediKeyContext';
import { NostrSync } from '@/components/shared/NostrSync';
import { Shield, Key, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function PatientProfile() {
  const { state } = useMediKey();
  const { toast } = useToast();
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);

  const copyToClipboard = async (text: string, type: 'public' | 'private') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'public') {
        setCopiedPublic(true);
        setTimeout(() => setCopiedPublic(false), 2000);
      } else {
        setCopiedPrivate(true);
        setTimeout(() => setCopiedPrivate(false), 2000);
      }
      toast({
        title: 'Copied!',
        description: `${type === 'public' ? 'Public' : 'Private'} key copied to clipboard.`,
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Patient Profile</h1>
        <p className="text-lg text-muted-foreground">
          Manage your cryptographic keys and account settings
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Identity Card */}
        <div className="crypto-card rounded-3xl p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Identity</h3>
            </div>
            <p className="text-muted-foreground">
              Your secure patient identifier
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                Patient Account
              </Badge>
              {state.currentUser.name && (
                <div className="space-y-1 mb-3">
                  <p className="text-sm font-medium">Patient Name</p>
                  <p className="text-lg font-semibold">{state.currentUser.name}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">Patient ID</p>
                <div className="flex items-center space-x-3">
                  <code className="flex-1 p-3 bg-muted/50 rounded-xl text-xs font-mono break-all border border-border/50">
                    {state.currentUser.publicKey}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(state.currentUser.publicKey, 'public')}
                    className="h-10 px-3 rounded-xl border-border/50"
                  >
                    {copiedPublic ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Security Status</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Keys Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Management */}
        <div className="crypto-card rounded-3xl p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-100 rounded-xl">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Key Management</h3>
            </div>
            <p className="text-muted-foreground">
              Manage your cryptographic keys securely
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Private Key</p>
              <div className="flex items-center space-x-3">
                <code className="flex-1 p-3 bg-muted/50 rounded-xl text-xs font-mono break-all border border-border/50">
                  {state.currentUser.privateKey.substring(0, 20)}...
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(state.currentUser.privateKey, 'private')}
                  className="h-10 px-3 rounded-xl border-border/50"
                >
                  {copiedPrivate ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep your private key secure and never share it
              </p>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Need to regenerate your keys? Visit the Settings page to access security options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nostr Sync */}
      <NostrSync />

      {/* Statistics */}
      <div className="crypto-card rounded-3xl p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Account Statistics</h3>
          <p className="text-muted-foreground">
            Overview of your MediKey activity
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-2xl bg-muted/30">
            <div className="text-3xl font-bold text-primary mb-1">{state.records.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Records</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-muted/30">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {state.accessGrants.filter(g => g.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Active Shares</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-muted/30">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {state.payments.filter(p => p.status === 'paid').length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Payments</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-muted/30">
            <div className="text-3xl font-bold text-orange-600 mb-1">{state.activityLog.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Activities</div>
          </div>
        </div>
      </div>
    </div>
  );
}