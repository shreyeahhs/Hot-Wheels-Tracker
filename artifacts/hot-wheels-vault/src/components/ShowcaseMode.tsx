import { useState, useEffect } from "react";
import { Car } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import HotWheelsPlaceholder from "./HotWheelsPlaceholder";

export default function ShowcaseMode({ cars, onClose }: { cars: Car[], onClose: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex(i => (i + 1) % cars.length);
      if (e.key === "ArrowLeft") setIndex(i => (i - 1 + cars.length) % cars.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cars.length, onClose]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % cars.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cars.length]);

  const car = cars[index];

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-6 right-6 z-50 flex gap-4">
        <button onClick={onClose} className="p-2 bg-black/50 border border-white/10 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <button 
        onClick={() => setIndex(i => (i - 1 + cars.length) % cars.length)}
        className="absolute left-6 z-50 p-4 bg-black/50 border border-white/10 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button 
        onClick={() => setIndex(i => (i + 1) % cars.length)}
        className="absolute right-6 z-50 p-4 bg-black/50 border border-white/10 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div 
          key={car.id}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex flex-col items-center justify-center p-12"
        >
          <div className="absolute inset-0 z-0 opacity-20">
            <HotWheelsPlaceholder className="w-full h-full rounded-none blur-3xl scale-110" compact />
          </div>
          
          <div className="relative z-10 w-full max-w-5xl aspect-video bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <HotWheelsPlaceholder className="w-full h-full rounded-none" />
          </div>

          <div className="relative z-10 mt-12 text-center">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black italic tracking-tighter uppercase mb-4"
            >
              {car.name}
            </motion.h2>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 font-mono text-lg"
            >
              <span className="text-white/60">{car.year}</span>
              <span className="text-primary">{car.series}</span>
              <span className="text-white/60">{car.color}</span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {cars.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === index ? 'w-8 bg-primary glow-shadow' : 'w-2 bg-white/20 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
