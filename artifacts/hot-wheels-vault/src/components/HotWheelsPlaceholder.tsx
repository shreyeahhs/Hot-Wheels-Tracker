type HotWheelsPlaceholderProps = {
  className?: string;
  compact?: boolean;
};

export default function HotWheelsPlaceholder({ className = "", compact = false }: HotWheelsPlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_40%),linear-gradient(135deg,#7a0f14_0%,#d61f2c_40%,#ff8a00_100%)] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_60%)]" />
      <div className="relative flex flex-col items-center justify-center px-6 text-center">
        <div className={`${compact ? "text-4xl" : "text-6xl"} font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]`}>
          Hot Wheels
        </div>
        <div className="mt-2 rounded-full border border-white/40 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.35em] text-white/90">
          Logo Placeholder
        </div>
      </div>
    </div>
  );
}