import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMediKey, generateKeyPair, generateId } from '@/contexts/MediKeyContext';
import type { UserRole } from '@/types/medikey';
import { Shield, Key, Users, Activity, UserPlus, LogIn, CheckCircle, Copy, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function LandingPage() {
  const { dispatch } = useMediKey();
  const { toast } = useToast();

  // Login state
  const [keyInput, setKeyInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLoginKey, setCopiedLoginKey] = useState(false);

  // Create account state
  const [newAccount, setNewAccount] = useState<{
    publicKey: string;
    privateKey: string;
    role: UserRole;
    name: string;
  } | null>(null);
  const [accountName, setAccountName] = useState('');
  const [newAccountRole, setNewAccountRole] = useState<UserRole>('patient');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<'public' | 'private' | null>(null);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    // Simulate key generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { publicKey, privateKey } = generateKeyPair();
    setKeyInput(publicKey);
    setIsGenerating(false);
  };

  const handleCreateAccount = async () => {
    if (!accountName.trim()) return;

    setIsCreating(true);

    try {
      // Simulate account creation process
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { publicKey, privateKey } = generateKeyPair();

      const account = {
        publicKey,
        privateKey,
        role: newAccountRole,
        name: accountName.trim()
      };

      setNewAccount(account);

      toast({
        title: 'Nostr Account Created!',
        description: 'Your new healthcare identity has been generated successfully.',
      });

    } catch (error) {
      toast({
        title: 'Account Creation Failed',
        description: 'There was an error creating your account.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUseNewAccount = () => {
    if (!newAccount) return;

    dispatch({
      type: 'SET_USER',
      payload: {
        publicKey: newAccount.publicKey,
        privateKey: newAccount.privateKey,
        role: newAccount.role,
        name: newAccount.name
      }
    });

    // Add welcome activity
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: generateId(),
        userId: newAccount.publicKey,
        action: 'access_request',
        description: `Created new ${newAccount.role} account: ${newAccount.name}`,
        timestamp: new Date()
      }
    });
  };

  const handleLogin = () => {
    if (!keyInput.trim()) return;

    // For mock purposes, extract or generate private key
    let privateKey = '';
    if (keyInput.startsWith('pk_')) {
      // If it's a public key, generate a corresponding private key
      privateKey = 'sk_' + keyInput.substring(3);
    } else if (keyInput.startsWith('sk_')) {
      // If it's a private key, derive public key
      privateKey = keyInput;
      setKeyInput('pk_' + keyInput.substring(3));
    } else {
      // Generate both
      const keys = generateKeyPair();
      setKeyInput(keys.publicKey);
      privateKey = keys.privateKey;
    }

    dispatch({
      type: 'SET_USER',
      payload: {
        publicKey: keyInput.startsWith('pk_') ? keyInput : 'pk_' + keyInput.substring(3),
        privateKey,
        role: selectedRole
      }
    });
  };

  const copyToClipboard = async (text: string, type: 'public' | 'private') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(type);
      setTimeout(() => setCopiedKey(null), 2000);
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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
                <div className="relative p-4 bg-primary rounded-2xl">
                  <Shield className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gradient mb-1">MediKey</h1>
                <p className="text-sm font-medium text-muted-foreground tracking-wide">
                  HEALTHCARE PROTOCOL
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground">
              Decentralized Health Records
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Powered by Bitcoin + Nostr • Secure, private, and patient-controlled healthcare data management
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="crypto-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Key className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Cryptographic Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your medical records are secured with public-key cryptography, ensuring only you control access.
            </p>
          </div>

          <div className="crypto-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Role-Based Access</h3>
            <p className="text-muted-foreground leading-relaxed">
              Patients control their data while clinicians access only what they need with permission.
            </p>
          </div>

          <div className="crypto-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Lightning Payments</h3>
            <p className="text-muted-foreground leading-relaxed">
              Instant micropayments for record verification and secure storage using Bitcoin Lightning.
            </p>
          </div>
        </div>

        {/* Authentication */}
        <div className="max-w-lg mx-auto">
          <div className="crypto-card rounded-3xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Access MediKey</h2>
                <p className="text-muted-foreground">
                  Sign in with existing keys or create a new Nostr healthcare identity
                </p>
              </div>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl">
                  <TabsTrigger
                    value="login"
                    className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="create"
                    className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
                  </TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="login" className="space-y-8 mt-8">
                  <div className="space-y-3">
                    <Label htmlFor="key-input" className="text-sm font-medium">Cryptographic Key</Label>
                    <div className="flex space-x-3">
                      <Input
                        id="key-input"
                        placeholder="Enter your public key (pk_...) or private key (sk_...)"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        className="font-mono text-sm h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                      />
                      {keyInput && (
                        <Button
                          variant="outline"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(keyInput);
                              setCopiedLoginKey(true);
                              setTimeout(() => setCopiedLoginKey(false), 2000);
                              toast({
                                title: 'Copied!',
                                description: 'Key copied to clipboard.',
                              });
                            } catch (err) {
                              toast({
                                title: 'Copy Failed',
                                description: 'Failed to copy key to clipboard.',
                                variant: 'destructive',
                              });
                            }
                          }}
                          className="shrink-0 h-12 px-4 rounded-xl border-border/50"
                        >
                          {copiedLoginKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleGenerateKeys}
                        disabled={isGenerating}
                        className="shrink-0 h-12 px-4 rounded-xl border-border/50"
                      >
                        {isGenerating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keys starting with "pk_" are public keys, "sk_" are private keys
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Account Type</Label>
                    <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)} className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                        <RadioGroupItem value="patient" id="patient" className="border-2" />
                        <Label htmlFor="patient" className="flex-1 cursor-pointer">
                          <div className="font-medium mb-1">Patient</div>
                          <div className="text-sm text-muted-foreground">
                            Upload and manage your health records
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                        <RadioGroupItem value="clinician" id="clinician" className="border-2" />
                        <Label htmlFor="clinician" className="flex-1 cursor-pointer">
                          <div className="font-medium mb-1">Clinician</div>
                          <div className="text-sm text-muted-foreground">
                            Access patient records with permission
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleLogin}
                    className="w-full h-12 rounded-xl button-gradient font-medium"
                    disabled={!keyInput.trim()}
                  >
                    Access Dashboard
                  </Button>
                </TabsContent>

                {/* Create Account Tab */}
                <TabsContent value="create" className="space-y-8 mt-8">
                  {!newAccount ? (
                    <>
                      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Create Healthcare Identity</h4>
                            <p className="text-sm text-blue-700">
                              Generate a new healthcare identity with automatically created cryptographic keys
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="account-name" className="text-sm font-medium">Full Name</Label>
                          <Input
                            id="account-name"
                            placeholder="Enter your full name"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                          />
                          <p className="text-xs text-muted-foreground">
                            This will be associated with your healthcare identity
                          </p>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Account Type</Label>
                          <RadioGroup value={newAccountRole} onValueChange={(value) => setNewAccountRole(value as UserRole)} className="space-y-3">
                            <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                              <RadioGroupItem value="patient" id="new-patient" className="border-2" />
                              <Label htmlFor="new-patient" className="flex-1 cursor-pointer">
                                <div className="font-medium mb-1">Patient Account</div>
                                <div className="text-sm text-muted-foreground">
                                  Manage your personal health records
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                              <RadioGroupItem value="clinician" id="new-clinician" className="border-2" />
                              <Label htmlFor="new-clinician" className="flex-1 cursor-pointer">
                                <div className="font-medium mb-1">Clinician Account</div>
                                <div className="text-sm text-muted-foreground">
                                  Access patient records with permission
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Button
                          onClick={handleCreateAccount}
                          disabled={!accountName.trim() || isCreating}
                          className="w-full h-12 rounded-xl button-gradient font-medium"
                        >
                          {isCreating ? 'Creating Account...' : 'Create Nostr Healthcare ID'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-900 mb-1">Account Created Successfully!</h4>
                            <p className="text-sm text-green-700">
                              Your Nostr healthcare identity has been generated with secure cryptographic keys.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Account Details</Label>
                          <div className="p-4 bg-muted/50 rounded-xl border border-border/50 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Name:</span>
                              <span className="text-sm font-medium">{newAccount.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Role:</span>
                              <span className="text-sm font-medium capitalize">{newAccount.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Public Key (Healthcare ID)</Label>
                          <div className="flex space-x-3">
                            <Input
                              value={newAccount.publicKey}
                              readOnly
                              className="font-mono text-xs h-12 rounded-xl bg-muted/30"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(newAccount.publicKey, 'public')}
                              className="shrink-0 h-12 px-4 rounded-xl border-border/50"
                            >
                              {copiedKey === 'public' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Private Key (Keep Secret)</Label>
                          <div className="flex space-x-3">
                            <Input
                              value={newAccount.privateKey}
                              readOnly
                              className="font-mono text-xs h-12 rounded-xl bg-muted/30"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(newAccount.privateKey, 'private')}
                              className="shrink-0 h-12 px-4 rounded-xl border-border/50"
                            >
                              {copiedKey === 'private' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                            <p className="text-xs text-red-800 flex items-center">
                              <Shield className="h-3 w-3 mr-2 flex-shrink-0" />
                              Save your private key securely. You'll need it to access your account.
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-border/50 pt-6">
                          <div className="space-y-4">
                            <Button
                              onClick={handleUseNewAccount}
                              className="w-full h-12 rounded-xl button-gradient font-medium"
                            >
                              Enter MediKey Dashboard
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                              Make sure to save your keys before proceeding
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Built for healthcare privacy and security</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Vibed with{' '}
            <a
              href="https://soapbox.pub/mkstack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              MKStack
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}