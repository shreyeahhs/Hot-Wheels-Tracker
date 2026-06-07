import { useGetCollectionStats, useListMessages, useListCars, useDeleteCar, getListCarsQueryKey, getGetCollectionStatsQueryKey } from "@workspace/api-client-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: stats } = useGetCollectionStats();
  const { data: messages } = useListMessages();
  const { data: cars } = useListCars();
  const deleteCar = useDeleteCar();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteCar = (id: number) => {
    if (confirm("Delete this car from the vault?")) {
      deleteCar.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Car deleted" });
          queryClient.invalidateQueries({ queryKey: getListCarsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetCollectionStatsQueryKey() });
        }
      });
    }
  };

  const chartData = (stats?.bySeries ?? []).map(s => ({
    name: s.series.length > 12 ? s.series.slice(0, 12) + "…" : s.series,
    count: s.count
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter neon-text mb-2">Vault Dashboard</h1>
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">System Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-xl border-white/10">
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Total Cars</div>
          <div className="text-4xl font-black font-mono">{stats?.totalCars || 0}</div>
        </div>
        <div className="glass-panel p-6 rounded-xl border-white/10">
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Unique Series</div>
          <div className="text-4xl font-black font-mono text-primary">{stats?.totalSeries || 0}</div>
        </div>
        <div className="glass-panel p-6 rounded-xl border-white/10">
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Latest Year</div>
          <div className="text-4xl font-black font-mono">{stats?.newestYear || "—"}</div>
        </div>
        <div className="glass-panel p-6 rounded-xl border-white/10">
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Oldest Year</div>
          <div className="text-4xl font-black font-mono">{stats?.oldestYear || "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border-white/10">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Cars by Series</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border-white/10 flex flex-col max-h-[400px]">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Recent Messages</h2>
          <div className="flex-1 overflow-auto space-y-4 pr-2">
            {messages?.length === 0 ? (
              <p className="text-muted-foreground font-mono text-sm">No messages.</p>
            ) : (
              messages?.map(msg => (
                <div key={msg.id} className="bg-black/50 p-4 rounded border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm">{msg.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{new Date(msg.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs text-primary mb-2">{msg.email}</div>
                  <p className="text-sm text-white/80">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border-white/10">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Inventory Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/50 font-mono">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Series</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars?.map(car => (
                <tr key={car.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-bold uppercase">{car.name}</td>
                  <td className="px-4 py-3 font-mono">{car.year}</td>
                  <td className="px-4 py-3">{car.series}</td>
                  <td className="px-4 py-3">{car.color}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/20 hover:text-destructive" onClick={() => handleDeleteCar(car.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
