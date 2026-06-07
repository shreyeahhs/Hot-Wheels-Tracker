import { Link } from "wouter";
import { Car } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import HotWheelsPlaceholder from "./HotWheelsPlaceholder";


export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/car/${car.id}`}>
      <motion.div 
        className="group relative glass-panel rounded-xl overflow-hidden cursor-pointer car-card-hover border border-white/5 bg-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="aspect-[4/3] w-full bg-black/50 relative overflow-hidden flex items-center justify-center">
          <HotWheelsPlaceholder className="w-full h-full rounded-none" compact />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
        </div>
        <div className="p-4 relative z-10">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-black italic text-lg tracking-tight uppercase truncate mr-2">{car.name}</h3>
            <span className="font-mono text-sm font-bold text-muted-foreground">{car.year}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground truncate">{car.series}</span>
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{car.color}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 group-hover:from-primary/10 group-hover:to-primary/20 pointer-events-none transition-colors" />
      </motion.div>
    </Link>
  );
}
