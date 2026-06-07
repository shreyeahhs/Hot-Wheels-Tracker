import { useListWishlist, useRemoveFromWishlist } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListWishlistQueryKey } from "@workspace/api-client-react";

export default function Wishlist() {
  const { data: wishlist, isLoading } = useListWishlist();
  const removeMutation = useRemoveFromWishlist();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRemove = (id: number) => {
    removeMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Removed from wishlist" });
        queryClient.invalidateQueries({ queryKey: getListWishlistQueryKey() });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter neon-text mb-2">The Hit List</h1>
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Most Wanted Models</p>
      </div>

      {isLoading ? (
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : wishlist?.length === 0 ? (
        <div className="text-center py-32">
          <h3 className="text-2xl font-black italic text-muted-foreground">WISHLIST IS EMPTY</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist?.map(item => (
            <div key={item.id} className="glass-panel p-6 rounded-xl border border-white/5 relative group">
              <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">{item.name}</h3>
              <div className="flex gap-4 font-mono text-sm text-muted-foreground mb-4">
                {item.year && <span>{item.year}</span>}
                {item.series && <span className="text-primary">{item.series}</span>}
              </div>
              {item.notes && <p className="text-sm text-white/70 italic bg-black/30 p-3 rounded">{item.notes}</p>}
              
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/20 text-destructive hover:bg-destructive hover:text-white"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
