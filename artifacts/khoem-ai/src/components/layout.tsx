import { Link, useLocation } from "wouter";
import { Shield, Activity, ShieldAlert, FileText, Zap, ChevronRight } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/scanner", label: "Scanner", icon: Zap },
    { href: "/rules", label: "Security Rules", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-sidebar flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="h-16 flex items-center px-6 border-b border-border bg-sidebar-accent/30">
          <Shield className="w-6 h-6 text-primary mr-3" />
          <h1 className="text-xl font-bold tracking-widest text-primary glow-text uppercase">
            KHOEM_AI
          </h1>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-4 tracking-widest px-2">
            System Modules
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center px-4 py-3 cursor-pointer group transition-all duration-200 border-l-2 ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary glow-text" : "group-hover:text-primary/70"}`} />
                  <span className="font-mono text-sm tracking-wide uppercase">
                    {item.label}
                  </span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary" />}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border bg-sidebar-accent/10">
          <div className="flex items-center text-xs font-mono text-success">
            <div className="w-2 h-2 rounded-full bg-success mr-2 shadow-[0_0_8px_rgba(50,255,50,0.8)] animate-pulse" />
            SYSTEM ONLINE
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-8 z-10">
          <div className="flex items-center text-sm font-mono text-muted-foreground">
            <span className="uppercase tracking-wider">Node:</span>
            <span className="ml-2 text-primary font-bold">SEC-ALPHA-99</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center font-mono text-xs">
              <span className="text-muted-foreground mr-2">V:</span>
              <span className="text-foreground">0.1.0-STABLE</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <ShieldAlert className="w-5 h-5 text-primary opacity-80" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 relative z-0">
          {/* Subtle grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-20" 
               style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
              }
