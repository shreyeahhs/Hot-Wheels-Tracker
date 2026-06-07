import { useGetSpotlightCar, useGetCollectionStats, useGetRecentCars } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function Home() {
  const { data: stats } = useGetCollectionStats();
  const { data: spotlight } = useGetSpotlightCar();
  const { data: recent } = useGetRecentCars({ limit: 4 });

  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    const ctaObserver = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (ctaRef.current) ctaObserver.observe(ctaRef.current);
    return () => { heroObserver.disconnect(); ctaObserver.disconnect(); };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Floating "See All" button — appears after scrolling past hero */}
      <AnimatePresence>
        {pastHero && !ctaVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-6 z-50"
          >
            <Link href="/collection">
              <Button className="h-12 px-6 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-none border border-primary glow-shadow shadow-lg flex items-center gap-2">
                See All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen md:h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Mobile background image */}
          <div className="md:hidden absolute inset-0">
            <img
              src="/mobile-bg.jpg"
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          </div>

          {/* Local video background — desktop/landscape only */}
          <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
            <video
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 object-cover"
              style={{
                width: "calc(100vh * 16 / 9)",
                height: "calc(100vw * 9 / 16)",
                minWidth: "100%",
                minHeight: "100%",
              }}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            >
              <source src="/YTDown_YouTube_Pagani-Huayra-4K_Media_Wc2UN3yL2CU_001_1080p.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase mb-4 neon-text">
              Shreyas's <br/><span className="text-white text-shadow-none">Hot Wheels Vault</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-mono tracking-wide max-w-2xl mx-auto">
              Personal diecast collection tracker. Know what you own before you shop.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/collection">
              <Button size="lg" className="h-14 px-8 text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-none border border-primary glow-shadow hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all">
                Enter the Vault
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="w-full bg-black/50 border-y border-white/10 backdrop-blur-lg relative z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center divide-x divide-white/10">
            <div>
              <div className="text-3xl font-black text-primary font-mono">{stats?.totalCars || 0}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Cars Owned</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white font-mono">{stats?.totalSeries || 0}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Unique Series</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white font-mono">{stats?.newestYear || "—"}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Latest Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight & Recent */}
      <section className="w-full container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-3 gap-12 relative z-20">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-black italic uppercase tracking-wider mb-6 neon-text">Spotlight</h2>
          {spotlight ? (
            <CarCard car={spotlight} />
          ) : (
            <div className="aspect-[4/3] glass-panel rounded-xl flex items-center justify-center">
              <span className="font-mono text-muted-foreground">No spotlight available</span>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-wider">Recent Additions</h2>
            <Link href="/collection" className="text-sm font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recent?.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Full-width CTA */}
      <section ref={ctaRef} className="w-full relative z-20 border-t border-white/10 bg-black/30">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
            <span className="neon-text">{stats?.totalCars || 0}</span>{" "}
            <span className="text-white/60">cars in the vault</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest max-w-md">
            Browse, search, and reference every model before you buy
          </p>
          <Link href="/collection">
            <Button size="lg" variant="outline" className="h-14 px-10 text-base font-black uppercase tracking-widest border-primary/50 text-primary hover:bg-primary hover:text-white rounded-none transition-all hover:glow-shadow">
              See Full Collection <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
