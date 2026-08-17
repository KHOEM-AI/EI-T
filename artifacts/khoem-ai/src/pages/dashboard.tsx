import { useGetSecurityStats, useGetValidationHistory } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Activity, BarChart3, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useGetSecurityStats();
  const { data: history, isLoading: isHistoryLoading } = useGetValidationHistory({ limit: 10 });

  if (isStatsLoading || isHistoryLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Activity className="w-12 h-12 text-primary animate-pulse mb-4" />
          <div className="text-primary font-mono tracking-widest uppercase animate-pulse">Initializing Telemetry...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-widest uppercase text-foreground mb-1">Command Center</h2>
          <p className="text-muted-foreground font-mono text-sm">Real-time threat detection telemetry</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 border border-primary/30 flex items-center">
          <div className="w-2 h-2 rounded-full bg-primary mr-3 animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
          <span className="font-mono text-sm tracking-widest text-primary uppercase">Live Feed Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono text-primary glow-text">
              {stats?.totalValidated.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-success" />
              Cleared
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono text-success glow-text-success">
              {stats?.totalPassed.toLocaleString() || 0}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-2">
              {stats?.totalValidated ? Math.round((stats.totalPassed / stats.totalValidated) * 100) : 0}% clearance rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-destructive bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-destructive" />
              Threats Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono text-destructive glow-text-danger">
              {stats?.totalBlocked.toLocaleString() || 0}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-2">
              {stats?.totalValidated ? Math.round((stats.totalBlocked / stats.totalValidated) * 100) : 0}% block rate
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Threat Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.blocksByType && Object.keys(stats.blocksByType).length > 0 ? (
                Object.entries(stats.blocksByType).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between font-mono text-sm mb-1">
                      <span className="text-muted-foreground uppercase">{type}</span>
                      <span className="text-destructive">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-none overflow-hidden">
                      <div 
                        className="h-full bg-destructive shadow-[0_0_8px_rgba(255,50,50,0.8)]" 
                        style={{ width: `${Math.min(100, ((count as number) / stats.totalBlocked) * 100)}%` }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm font-mono text-muted-foreground text-center py-8">
                  NO THREAT DATA
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {history?.map((item) => (
                <div key={item.id} className="p-4 hover:bg-secondary/30 transition-colors flex items-start space-x-4">
                  <div className="mt-1">
                    {item.passed ? (
                      <ShieldCheck className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        {item.passed ? (
                          <Badge variant="success" className="text-[10px] h-5">CLEARED</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] h-5">BLOCKED: {item.blockedBy}</Badge>
                        )}
                      </div>
                      <span className="font-mono text-xs text-primary/70">ID-{item.id}</span>
                    </div>
                    <p className="text-sm font-mono truncate text-foreground/80">
                      "{item.text}"
                    </p>
                  </div>
                </div>
              ))}
              {(!history || history.length === 0) && (
                <div className="p-8 text-center text-sm font-mono text-muted-foreground">
                  NO RECENT ACTIVITY
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
