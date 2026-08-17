import { useGetSecurityRules } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Shield, Power, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Rules() {
  const { data: rules, isLoading } = useGetSecurityRules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Activity className="w-12 h-12 text-primary animate-pulse mb-4" />
          <div className="text-primary font-mono tracking-widest uppercase animate-pulse">Loading Protocol Matrices...</div>
        </div>
      </div>
    );
  }

  // Group by category
  const inputRules = rules?.filter(r => r.category === 'input') || [];
  const outputRules = rules?.filter(r => r.category === 'output') || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-widest uppercase text-foreground mb-1 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-primary" />
          Security Protocols
        </h2>
        <p className="text-muted-foreground font-mono text-sm">Active engine rule definitions</p>
      </div>

      <div className="space-y-8">
        {/* Input Rules */}
        <div>
          <div className="flex items-center mb-4 border-b border-border pb-2">
            <h3 className="text-lg font-bold font-mono tracking-widest uppercase text-primary">Input Filters</h3>
            <Badge variant="outline" className="ml-4">{inputRules.length} ACTIVE</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputRules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
            {inputRules.length === 0 && (
              <div className="col-span-2 p-8 border border-dashed border-border text-center font-mono text-muted-foreground">
                No input protocols configured
              </div>
            )}
          </div>
        </div>

        {/* Output Rules */}
        <div>
          <div className="flex items-center mb-4 border-b border-border pb-2">
            <h3 className="text-lg font-bold font-mono tracking-widest uppercase text-primary">Output Filters</h3>
            <Badge variant="outline" className="ml-4">{outputRules.length} ACTIVE</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outputRules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
            {outputRules.length === 0 && (
              <div className="col-span-2 p-8 border border-dashed border-border text-center font-mono text-muted-foreground">
                No output protocols configured
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ rule }: { rule: any }) {
  return (
    <Card className={`border-l-4 ${rule.enabled ? 'border-l-primary' : 'border-l-muted opacity-60'}`}>
      <CardContent className="p-5 flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="font-bold tracking-wide uppercase text-foreground font-mono truncate mr-2">
              {rule.name}
            </div>
            {rule.enabled ? (
              <Badge variant="default" className="bg-primary/20 text-primary shrink-0">
                <Power className="w-3 h-3 mr-1" /> ON
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0 text-muted-foreground">
                <Power className="w-3 h-3 mr-1" /> OFF
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {rule.description}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-xs font-mono text-muted-foreground">
          <span className="opacity-50">ID: {rule.id}</span>
          <Shield className={`w-4 h-4 ${rule.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </CardContent>
    </Card>
  );
}
