import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSyncWithNostr } from '@/hooks/useMediKeyNostr';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { NetworkIcon } from '@/components/icons/BitcoinIcons';
import { useToast } from '@/hooks/useToast';
import { useState, useEffect } from 'react';

export function NostrSync() {
  const { mutate: syncWithNostr, isPending: isSyncing } = useSyncWithNostr();
  const { toast } = useToast();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = () => {
    syncWithNostr(undefined, {
      onSuccess: () => {
        setLastSync(new Date());
        toast({
          title: 'Sync Complete',
          description: 'Successfully synced with Nostr network.',
        });
      },
      onError: () => {
        toast({
          title: 'Sync Failed',
          description: 'Failed to sync with Nostr network.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <NetworkIcon className="h-4 w-4 text-blue-600" size={16} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-sm">Nostr Network</h4>
                <Badge
                  variant={isOnline ? "default" : "secondary"}
                  className={`text-xs ${isOnline ? 'bg-accent/20 text-accent-foreground' : 'bg-gray-100 text-gray-800'}`}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {lastSync
                  ? `Last sync: ${lastSync.toLocaleTimeString()}`
                  : 'Not synced yet'
                }
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing || !isOnline}
            className="h-9 px-3 rounded-lg border-border/50"
          >
            {isSyncing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}