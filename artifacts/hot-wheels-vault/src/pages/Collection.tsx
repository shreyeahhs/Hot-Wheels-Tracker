import { useState, useEffect } from "react";
import { useListCars } from "@workspace/api-client-react";
import CarCard from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, ChevronUp } from "lucide-react";
import ShowcaseMode from "@/components/ShowcaseMode";
import { motion, AnimatePresence } from "framer-motion";

export default function Collection() {
  const [search, setSearch] = useState("");
  const [showcase, setShowcase] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: cars, isLoading } = useListCars({
    search: search || undefined,
  });

  if (showcase && cars) {
    return <ShowcaseMode cars={cars} onClose={() => setShowcase(false)} />;
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-6 z-50 p-3 bg-black/80 border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-colors backdrop-blur"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter neon-text mb-2">My Collection</h1>
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Shreyas's Hot Wheels Vault</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Input 
            placeholder="SEARCH MODELS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black/50 border-white/10 font-mono text-sm uppercase tracking-wider w-full md:w-64"
          />
          <Button 
            onClick={() => setShowcase(true)}
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary hover:text-white transition-colors"
            disabled={!cars || cars.length === 0}
          >
            <Play className="w-4 h-4 mr-2" />
            SHOWCASE
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : cars?.length === 0 ? (
        <div className="text-center py-32">
          <h3 className="text-2xl font-black italic text-muted-foreground">NO CARS FOUND</h3>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {cars?.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
