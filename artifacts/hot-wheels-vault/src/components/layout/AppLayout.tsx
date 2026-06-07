import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import ContactModal from "@/components/ContactModal";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [nitroBoost, setNitroBoost] = useState(false);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 500) {
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }
    lastClickTimeRef.current = now;

    if (clickCountRef.current >= 5 && !nitroBoost) {
      setNitroBoost(true);
      setTimeout(() => setNitroBoost(false), 2000);
      clickCountRef.current = 0;
    }
  }, [nitroBoost]);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-background">
      <AnimatePresence>
        {nitroBoost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none mix-blend-screen"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255, 69, 0, 0.4) 100%)",
              boxShadow: "inset 0 0 100px rgba(255, 69, 0, 0.8)",
            }}
          >
            <div className="absolute inset-0 bg-grid-floor animate-grid-flow" style={{ animationDuration: "0.5s" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background grid */}
      <div className={`absolute inset-0 z-0 opacity-20 pointer-events-none perspective-floor transition-all duration-1000 ${nitroBoost ? 'opacity-80' : ''}`}>
        <div className={`absolute inset-0 bg-grid-floor ${nitroBoost ? 'animate-grid-flow' : 'animate-grid-flow'}`} style={{ animationDuration: nitroBoost ? '2s' : '20s' }} />
      </div>

      {/* Header */}
      <header className={`z-20 top-0 left-0 right-0 transition-all duration-300 ${
        location === "/"
          ? "fixed bg-transparent border-transparent"
          : "sticky glass-panel border-b border-white/10"
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {location !== "/" && (
            <Link href="/" onClick={handleLogoClick} className="text-xl font-black italic tracking-tighter text-primary neon-text select-none cursor-pointer">
              SHREYAS'S VAULT
            </Link>
          )}
          {location === "/" && <span />}
          <nav className="flex items-center gap-6">
            <Link
              href="/collection"
              className={`text-sm font-semibold tracking-wide transition-colors uppercase relative pb-0.5 ${
                location === "/collection"
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                  : "hover:text-primary"
              }`}
            >
              Collection
            </Link>
            <ContactModal />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono">
            &copy; {new Date().getFullYear()} Shreyas's Hot Wheels Vault.
          </p>
          <div className="mt-4 flex justify-center">
            <Link href="/admin" className="text-xs text-muted-foreground/50 hover:text-primary transition-colors">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { ReactNode } from "react";
