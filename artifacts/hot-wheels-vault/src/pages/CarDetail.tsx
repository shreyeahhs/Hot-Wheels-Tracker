import { useGetCar } from "@workspace/api-client-react";
import { Link } from "wouter";
import { getGetCarQueryKey } from "@workspace/api-client-react";
import { ArrowLeft } from "lucide-react";
import HotWheelsPlaceholder from "../components/HotWheelsPlaceholder";

export default function CarDetail({ id }: { id: number }) {
  const { data: car, isLoading } = useGetCar(id, { 
    query: { enabled: !!id, queryKey: getGetCarQueryKey(id) } 
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!car) {
    return <div className="container mx-auto px-4 py-24 text-center"><h1 className="text-2xl font-black italic text-muted-foreground">CAR NOT FOUND</h1></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/collection" className="inline-flex items-center text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="glass-panel aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center bg-black/60 relative group">
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
          <HotWheelsPlaceholder className="w-full h-full rounded-none" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-6xl font-black italic tracking-tighter uppercase mb-4 neon-text">{car.name}</h1>
            <div className="flex flex-wrap items-center gap-4 font-mono">
              <div className="px-3 py-1 bg-white/5 rounded text-lg">{car.year}</div>
              <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-lg uppercase tracking-wider">{car.series}</div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-lg uppercase tracking-wider">{car.color}</div>
            </div>
          </div>

          <div className="space-y-6">
            {car.description && (
              <div>
                <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-2">Description</h3>
                <p className="text-lg leading-relaxed text-white/80">{car.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-2">Acquired</h3>
              <p className="text-lg text-white/60">{new Date(car.dateAdded).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
