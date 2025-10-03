import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediKey } from '@/contexts/MediKeyContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Share2,
  Zap,
  Activity,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export function Analytics() {
  const { state } = useMediKey();
  const { analytics } = state;

  const isPatient = state.currentUser?.role === 'patient';

  // Prepare data for charts
  const recordTypeData = Object.entries(analytics.recordsByType).map(([type, count]) => ({
    type: type.replace('_', ' '),
    count,
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  }));

  const activityTrendData = analytics.activityHistory.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  // Colors for charts - earth tone palette
  const colors = ['#D97706', '#059669', '#DC2626', '#7C2D12', '#92400E'];

  // Calculate additional metrics
  const totalActivities = analytics.activityHistory.reduce((sum, day) =>
    sum + day.uploads + day.shares + day.payments, 0
  );

  const activeShares = state.accessGrants.filter(grant => grant.isActive).length;
  const uniqueConnections = isPatient
    ? new Set(state.accessGrants.filter(g => g.isActive).map(g => g.clinicianId)).size
    : new Set(state.accessGrants.filter(g => g.clinicianId === state.currentUser?.publicKey && g.isActive).map(g => g.patientId)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          {isPatient ? 'Your health data insights and sharing activity' : 'Clinical practice analytics and patient overview'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isPatient ? 'Total Records' : 'Accessible Records'}
                </p>
                <p className="text-2xl font-bold">{analytics.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Shares</p>
                <p className="text-2xl font-bold">{activeShares}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lightning Payments</p>
                <p className="text-2xl font-bold">{analytics.totalPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isPatient ? 'Clinicians' : 'Patients'}
                </p>
                <p className="text-2xl font-bold">{uniqueConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Record Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Record Types</CardTitle>
            <CardDescription>
              Distribution of health records by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recordTypeData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={recordTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {recordTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Trend</CardTitle>
            <CardDescription>
              Daily activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityTrendData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={activityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uploads"
                    stackId="1"
                    stroke="#D97706"
                    fill="#D97706"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="shares"
                    stackId="1"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="payments"
                    stackId="1"
                    stroke="#7C2D12"
                    fill="#7C2D12"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity Breakdown</CardTitle>
          <CardDescription>
            Detailed view of activities by type over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityTrendData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uploads" fill="#D97706" name="Uploads" />
                <Bar dataKey="shares" fill="#059669" name="Shares" />
                <Bar dataKey="payments" fill="#7C2D12" name="Payments" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
          <CardDescription>
            Overview of your MediKey usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Growth Metrics</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Total Activities: {totalActivities}</div>
                <div>Active Connections: {uniqueConnections}</div>
                <div>Verification Rate: {analytics.totalRecords > 0 ? Math.round((state.records.filter(r => r.verified).length / analytics.totalRecords) * 100) : 0}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Usage Patterns</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Average Daily Uploads: {(activityTrendData.reduce((sum, day) => sum + day.uploads, 0) / Math.max(activityTrendData.length, 1)).toFixed(1)}</div>
                <div>Share Ratio: {analytics.totalRecords > 0 ? ((activeShares / analytics.totalRecords) * 100).toFixed(1) : 0}%</div>
                <div>Payment Success: {state.payments.length > 0 ? Math.round((state.payments.filter(p => p.status === 'paid').length / state.payments.length) * 100) : 0}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Timeline</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Account Age: {state.currentUser ? 'New User' : 'N/A'}</div>
                <div>Last Activity: {state.activityLog.length > 0 ? 'Recent' : 'None'}</div>
                <div>Most Active Day: {activityTrendData.length > 0 ? activityTrendData.reduce((max, day) =>
                  (day.uploads + day.shares + day.payments) > (max.uploads + max.shares + max.payments) ? day : max
                ).date : 'N/A'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}