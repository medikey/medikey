import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMediKey } from '@/contexts/MediKeyContext';
import {
  Clock,
  Upload,
  Share2,
  UserX,
  Zap,
  Search,
  FileText,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import type { ActivityLog } from '@/types/medikey';

export function ActivityHistory() {
  const { state } = useMediKey();

  const userActivities = state.activityLog
    .filter(log => log.userId === state.currentUser?.publicKey)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getActivityIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'upload': return <Upload className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      case 'revoke': return <UserX className="h-4 w-4" />;
      case 'payment': return <Zap className="h-4 w-4" />;
      case 'access_request': return <Search className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: ActivityLog['action']) => {
    switch (action) {
      case 'upload': return 'bg-blue-100 text-blue-800';
      case 'share': return 'bg-accent/20 text-accent-foreground';
      case 'revoke': return 'bg-red-100 text-red-800';
      case 'payment': return 'bg-purple-100 text-purple-800';
      case 'access_request': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: ActivityLog['action']) => {
    switch (action) {
      case 'upload': return 'Upload';
      case 'share': return 'Share';
      case 'revoke': return 'Revoke';
      case 'payment': return 'Payment';
      case 'access_request': return 'Request';
      default: return 'Activity';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground">
          Timeline of your MediKey activities and transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activities</span>
          </CardTitle>
          <CardDescription>
            Your activity log and transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userActivities.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No activities recorded yet. Start by uploading records or requesting access.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-muted rounded-lg">
                      {getActivityIcon(activity.action)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <Badge className={getActivityColor(activity.action)}>
                        {getActionLabel(activity.action)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(activity.timestamp, 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>

                    {activity.metadata && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {activity.metadata.recordId && (
                          <span className="mr-4">Record ID: {activity.metadata.recordId.substring(0, 8)}...</span>
                        )}
                        {activity.metadata.clinicianId && (
                          <span className="mr-4">Clinician: {activity.metadata.clinicianId.substring(0, 12)}...</span>
                        )}
                        {activity.metadata.patientId && (
                          <span className="mr-4">Patient: {activity.metadata.patientId.substring(0, 12)}...</span>
                        )}
                        {activity.metadata.amount && (
                          <span className="mr-4">Amount: {activity.metadata.amount} sats</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>
            Overview of your total activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(['upload', 'share', 'revoke', 'payment', 'access_request'] as const).map((action) => {
              const count = userActivities.filter(a => a.action === action).length;
              return (
                <div key={action} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      {getActivityIcon(action)}
                    </div>
                  </div>
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {action.replace('_', ' ')}s
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}