import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("hwv_token");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("hwv_token");
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-black italic tracking-tighter text-primary neon-text block">
            VAULT ADMIN
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link
            href="/admin"
            className={`px-4 py-2 rounded-md text-sm font-mono transition-colors border ${
              location === "/admin"
                ? "bg-primary/20 text-primary border-primary/30"
                : "border-transparent hover:bg-primary/10 hover:text-primary"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/add"
            className={`px-4 py-2 rounded-md text-sm font-mono transition-colors border ${
              location === "/admin/add"
                ? "bg-primary/20 text-primary border-primary/30"
                : "border-transparent hover:bg-primary/10 hover:text-primary"
            }`}
          >
            Add Car
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm font-mono text-destructive hover:bg-destructive/10 rounded-md transition-colors text-left">
            LOGOUT
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-auto p-8 relative">
         <div className="absolute inset-0 bg-grid-floor opacity-10 pointer-events-none" />
         <div className="relative z-10 max-w-6xl mx-auto w-full">
            {children}
         </div>
      </main>
    </div>
  );
}
