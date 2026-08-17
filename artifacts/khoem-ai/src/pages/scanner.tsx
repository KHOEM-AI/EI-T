import { useState, useEffect, useRef } from "react";
import { useValidateInput } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Zap, Server, Shield, Loader2, Target, CheckCircle2, XCircle } from "lucide-react";
import type { ValidationResult, CheckResult } from "@workspace/api-client-react";

export default function Scanner() {
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [visibleChecks, setVisibleChecks] = useState<CheckResult[]>([]);
  const [showVerdict, setShowVerdict] = useState(false);
  
  const validateInput = useValidateInput();

  const handleScan = async () => {
    if (!input.trim()) return;
    
    setScanning(true);
    setResult(null);
    setVisibleChecks([]);
    setShowVerdict(false);

    try {
      // Execute API call
      const res = await validateInput.mutateAsync({ data: { text: input } });
      setResult(res);
      
      // Simulate sequential scanning for dramatic effect
      if (res.checks && res.checks.length > 0) {
        let index = 0;
        const interval = setInterval(() => {
          setVisibleChecks(prev => [...prev, res.checks[index]]);
          index++;
          
          if (index >= res.checks.length) {
            clearInterval(interval);
            setTimeout(() => {
              setShowVerdict(true);
              setScanning(false);
            }, 500); // Drama pause before verdict
          }
        }, 600); // Time between each check showing up
      } else {
        // Fallback if no checks array
        setShowVerdict(true);
        setScanning(false);
      }
    } catch (error) {
      console.error("Scan failed", error);
      setScanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto">
      {/* Input Section */}
      <div className="flex-1 flex flex-col space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-widest uppercase text-foreground mb-1 flex items-center">
            <Target className="w-6 h-6 mr-3 text-primary" />
            Active Scanner
          </h2>
          <p className="text-muted-foreground font-mono text-sm">Input payload for deep inspection</p>
        </div>

        <Card className="flex-1 flex flex-col border-primary/20 bg-background/50 backdrop-blur">
          <CardHeader className="bg-primary/5 py-3 border-b border-primary/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-primary flex items-center">
              <Server className="w-4 h-4 mr-2" />
              PAYLOAD BUFFER
            </CardTitle>
            <div className="font-mono text-xs text-primary/60">RAW_TEXT_STREAM</div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste suspicious text payload here..."
              className="flex-1 border-0 resize-none rounded-none focus-visible:ring-0 p-6 font-mono text-base bg-transparent min-h-[300px]"
              disabled={scanning}
            />
            <div className="p-4 border-t border-border bg-card/50 flex justify-between items-center">
              <div className="font-mono text-xs text-muted-foreground">
                BYTES: {new Blob([input]).size}
              </div>
              <Button 
                onClick={handleScan} 
                disabled={!input.trim() || scanning}
                size="lg"
                className="w-48 font-mono text-lg tracking-widest group"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    SCANNING
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2 group-hover:text-primary-foreground group-hover:animate-pulse" />
                    INITIATE
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Output Section */}
      <div className="flex-1 flex flex-col w-full lg:w-1/2">
        <Card className="flex-1 flex flex-col h-full bg-background border-border relative overflow-hidden">
          <CardHeader className="bg-secondary/30 py-3 border-b border-border flex flex-row items-center justify-between z-10">
            <CardTitle className="text-sm flex items-center text-muted-foreground">
              <Shield className="w-4 h-4 mr-2" />
              INSPECTION LOG
            </CardTitle>
            {scanning && (
              <Badge variant="outline" className="animate-pulse text-primary border-primary">
                ANALYSIS IN PROGRESS
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 font-mono z-10 relative">
            {!result && !scanning && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Shield className="w-16 h-16 mb-4" />
                <p className="tracking-widest uppercase">System Standby</p>
                <p className="text-xs mt-2">Awaiting payload input</p>
              </div>
            )}

            {visibleChecks.map((check, idx) => (
              <div 
                key={idx} 
                className="animate-in fade-in slide-in-from-left-4 duration-300 p-4 border border-border bg-secondary/10 flex items-start"
              >
                <div className="mr-4 mt-0.5">
                  {check.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-success shadow-[0_0_10px_rgba(50,255,50,0.4)] rounded-full" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive shadow-[0_0_10px_rgba(255,50,50,0.4)] rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold tracking-wider uppercase ${check.passed ? 'text-foreground' : 'text-destructive'}`}>
                      {check.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {check.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {check.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Final Verdict */}
            {showVerdict && result && (
              <div className="mt-8 animate-in fade-in zoom-in duration-500">
                <div className={`p-6 border-2 flex flex-col items-center text-center ${
                  result.passed 
                    ? 'border-success bg-success/10 shadow-[0_0_30px_rgba(50,255,50,0.15)]' 
                    : 'border-destructive bg-destructive/10 shadow-[0_0_30px_rgba(255,50,50,0.15)]'
                }`}>
                  {result.passed ? (
                    <>
                      <ShieldCheck className="w-16 h-16 text-success mb-4 drop-shadow-[0_0_15px_rgba(50,255,50,0.5)]" />
                      <h3 className="text-2xl font-bold text-success tracking-widest uppercase glow-text-success">
                        Payload Cleared
                      </h3>
                      <p className="text-success/70 text-sm mt-2">No threats detected. Safe for processing.</p>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-16 h-16 text-destructive mb-4 drop-shadow-[0_0_15px_rgba(255,50,50,0.5)]" />
                      <h3 className="text-2xl font-bold text-destructive tracking-widest uppercase glow-text-danger">
                        Threat Neutralized
                      </h3>
                      <p className="text-destructive/80 text-sm mt-2">
                        Blocked by rule: <span className="font-bold">{result.blockedBy}</span>
                      </p>
                    </>
                  )}
                  <div className="mt-4 pt-4 border-t border-current/20 w-full flex justify-between text-xs opacity-70">
                    <span>ID: {result.id}</span>
                    <span>TS: {new Date(result.timestamp).toISOString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Auto-scroll anchor */}
            <div className="h-4" />
          </CardContent>
          
          {/* Scanline overlay for output pane */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
               style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,1) 50%)', backgroundSize: '100% 4px' }} />
        </Card>
      </div>
    </div>
  );
}
